import prisma from '../config/db.js';

/**
 * Checks if a given station has an active reservation that collides with [startTime, endTime].
 * Formula: reservation.startTime < requestedEndTime AND reservation.endTime > requestedStartTime
 *
 * @param {string} stationId
 * @param {Date} startTime
 * @param {Date} endTime
 * @param {string|null} excludeReservationId (optional, when updating an existing reservation)
 * @returns {Promise<Array>} List of conflicting reservations
 */
export const findStationCollisions = async (stationId, startTime, endTime, excludeReservationId = null) => {
  const conflicting = await prisma.reservationStation.findMany({
    where: {
      stationId,
      reservation: {
        status: 'ACTIVE',
        id: excludeReservationId ? { not: excludeReservationId } : undefined,
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    },
    include: {
      reservation: true,
      station: true,
    },
  });

  return conflicting;
};

/**
 * Validates availability for multiple stations across a designated time window.
 * Returns an object with `available` (boolean) and `conflicts` (array).
 *
 * @param {Array<string>} stationIds
 * @param {Date} startTime
 * @param {Date} endTime
 * @param {string|null} excludeReservationId
 */
export const checkMultipleStationsAvailability = async (
  stationIds,
  startTime,
  endTime,
  excludeReservationId = null
) => {
  const collisions = await prisma.reservationStation.findMany({
    where: {
      stationId: { in: stationIds },
      reservation: {
        status: 'ACTIVE',
        id: excludeReservationId ? { not: excludeReservationId } : undefined,
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    },
    include: {
      station: true,
      reservation: true,
    },
  });

  // Also check if any station is under maintenance
  const maintenanceStations = await prisma.station.findMany({
    where: {
      id: { in: stationIds },
      status: 'MAINTENANCE',
    },
  });

  const conflicts = [];

  for (const c of collisions) {
    conflicts.push({
      stationId: c.stationId,
      stationCode: c.station.code,
      stationName: c.station.name,
      reason: `Already reserved by ${c.reservation.customerName} until ${new Date(c.reservation.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      conflictingReservationId: c.reservation.id,
      conflictingStart: c.reservation.startTime,
      conflictingEnd: c.reservation.endTime,
    });
  }

  for (const m of maintenanceStations) {
    conflicts.push({
      stationId: m.id,
      stationCode: m.code,
      stationName: m.name,
      reason: 'Station is currently locked for maintenance',
      isMaintenance: true,
    });
  }

  return {
    isAvailable: conflicts.length === 0,
    conflicts,
  };
};

/**
 * Automatically evaluates station real-time statuses and updates them if they have expired.
 * Also returns real-time status of all stations for the current timestamp.
 */
export const syncLiveStationStatuses = async () => {
  const now = new Date();

  // Find all ACTIVE reservations that have passed their endTime
  const expiredReservations = await prisma.reservation.findMany({
    where: {
      status: 'ACTIVE',
      endTime: { lte: now },
    },
    include: {
      stations: {
        include: {
          station: true,
        },
      },
    },
  });

  if (expiredReservations.length > 0) {
    const expiredIds = expiredReservations.map((r) => r.id);
    await prisma.reservation.updateMany({
      where: { id: { in: expiredIds } },
      data: { status: 'COMPLETED' },
    });
  }

  // Find currently active reservations for this moment
  const currentActive = await prisma.reservationStation.findMany({
    where: {
      reservation: {
        status: 'ACTIVE',
        startTime: { lte: now },
        endTime: { gt: now },
      },
    },
    select: { stationId: true },
  });

  const currentlyOccupiedStationIds = new Set(currentActive.map((a) => a.stationId));

  // Fetch all stations
  const allStations = await prisma.station.findMany();

  // Update stations in DB if their status needs updating (excluding MAINTENANCE)
  for (const station of allStations) {
    if (station.status === 'MAINTENANCE') continue;

    const shouldBeOccupied = currentlyOccupiedStationIds.has(station.id);
    const newStatus = shouldBeOccupied ? 'OCCUPIED' : 'AVAILABLE';

    if (station.status !== newStatus) {
      await prisma.station.update({
        where: { id: station.id },
        data: { status: newStatus },
      });
    }
  }

  return allStations;
};
