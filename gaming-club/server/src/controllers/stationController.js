import prisma from '../config/db.js';
import { syncLiveStationStatuses } from '../services/collisionService.js';
import { broadcastStationStatusUpdated } from '../config/socket.js';

/**
 * Get all stations (both PC and PS5) with live status calculation
 */
export const getAllStations = async (req, res, next) => {
  try {
    await syncLiveStationStatuses();

    const now = new Date();
    const stations = await prisma.station.findMany({
      orderBy: { code: 'asc' },
      include: {
        reservations: {
          where: {
            reservation: {
              status: 'ACTIVE',
              endTime: { gt: now },
            },
          },
          include: {
            reservation: {
              select: {
                id: true,
                bookingCode: true,
                customerName: true,
                startTime: true,
                endTime: true,
                status: true,
              },
            },
          },
        },
      },
    });

    const parsed = stations.map((st) => {
      let parsedSpecs = st.specs;
      try {
        parsedSpecs = JSON.parse(st.specs);
      } catch (e) {
        // keep as string
      }
      return {
        ...st,
        specsObj: parsedSpecs,
        activeReservations: st.reservations.map((r) => r.reservation),
      };
    });

    res.json({
      success: true,
      count: parsed.length,
      data: parsed,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get stations by type ('PC' or 'PS5')
 */
export const getStationsByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    const normalizedType = type.toUpperCase();

    await syncLiveStationStatuses();
    const now = new Date();

    const stations = await prisma.station.findMany({
      where: { type: normalizedType },
      orderBy: { code: 'asc' },
      include: {
        reservations: {
          where: {
            reservation: {
              status: 'ACTIVE',
              endTime: { gt: now },
            },
          },
          include: {
            reservation: {
              select: {
                id: true,
                bookingCode: true,
                customerName: true,
                startTime: true,
                endTime: true,
              },
            },
          },
        },
      },
    });

    const parsed = stations.map((st) => {
      let parsedSpecs = st.specs;
      try {
        parsedSpecs = JSON.parse(st.specs);
      } catch (e) {
        // keep as string
      }
      return {
        ...st,
        specsObj: parsedSpecs,
        activeReservations: st.reservations.map((r) => r.reservation),
      };
    });

    res.json({
      success: true,
      count: parsed.length,
      data: parsed,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single station by ID or Code
 */
export const getStationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const station = await prisma.station.findFirst({
      where: {
        OR: [{ id }, { code: id.toUpperCase() }],
      },
      include: {
        reservations: {
          include: {
            reservation: true,
          },
        },
      },
    });

    if (!station) {
      return res.status(404).json({
        success: false,
        error: 'Station topilmadi.',
      });
    }

    res.json({
      success: true,
      data: station,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin action: toggle station status (e.g. lock/unlock for maintenance)
 */
export const updateStationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Yaroqsiz status: ${status}. Qabul qilinadigan statuslar: ${validStatuses.join(', ')}`,
      });
    }

    const updated = await prisma.station.update({
      where: { id },
      data: { status },
    });

    // Real-time broadcast to all connected clients
    broadcastStationStatusUpdated({
      stationId: updated.id,
      stationCode: updated.code,
      status: updated.status,
    });

    res.json({
      success: true,
      message: `${updated.code} statusi '${updated.status}' holatiga oʻzgartirildi.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
