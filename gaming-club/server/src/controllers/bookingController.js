import prisma from '../config/db.js';
import { calculateBookingSummary } from '../services/pricingService.js';
import {
  checkMultipleStationsAvailability,
  syncLiveStationStatuses,
} from '../services/collisionService.js';
import {
  broadcastStationReserved,
  broadcastStationReleased,
  broadcastReservationCreated,
  broadcastReservationCancelled,
} from '../config/socket.js';

// Helper to generate readable booking code
const generateBookingCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'CC-';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Public dynamic pricing calculation preview
 */
export const calculatePricing = async (req, res, next) => {
  try {
    const { stationIds, stationType, requestedHours = 1 } = req.body;

    let stations = [];
    if (Array.isArray(stationIds) && stationIds.length > 0) {
      stations = await prisma.station.findMany({
        where: { id: { in: stationIds } },
      });
    } else if (stationType) {
      const count = parseInt(req.body.stationCount, 10) || 1;
      stations = Array(count).fill({ type: stationType });
    }

    const summary = calculateBookingSummary(stations, parseInt(requestedHours, 10) || 1);

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Check if stations are free for a given time window
 */
export const checkAvailability = async (req, res, next) => {
  try {
    const { stationIds, startTime, requestedHours = 1 } = req.body;

    if (!Array.isArray(stationIds) || stationIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Kamida bitta kompyuter yoki zal tanlanishi shart.',
      });
    }

    const start = startTime ? new Date(startTime) : new Date();
    const hours = Math.max(1, parseInt(requestedHours, 10) || 1);

    // Apply +1 hour bonus if >= 5 stations
    const totalDurationHours = stationIds.length >= 5 ? hours + 1 : hours;
    const end = new Date(start.getTime() + totalDurationHours * 60 * 60 * 1000);

    const check = await checkMultipleStationsAvailability(stationIds, start, end);

    res.json({
      success: true,
      isAvailable: check.isAvailable,
      conflicts: check.conflicts,
      checkedWindow: {
        start,
        end,
        totalDurationHours,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new Reservation with concurrency locking and WebSocket broadcast
 */
export const createBooking = async (req, res, next) => {
  try {
    const { stationIds, startTime, requestedHours = 1, notes } = req.body;
    const { customerName, customerPhone, customerAge } = req.validatedCustomer;

    if (!Array.isArray(stationIds) || stationIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Iltimos, bron qilish uchun kamida bitta joy tanlang.',
      });
    }

    const hours = Math.max(1, parseInt(requestedHours, 10) || 1);
    const start = startTime ? new Date(startTime) : new Date();

    // Fetch stations to compute dynamic pricing and verify existence
    const stations = await prisma.station.findMany({
      where: { id: { in: stationIds } },
    });

    if (stations.length !== stationIds.length) {
      return res.status(404).json({
        success: false,
        error: 'Tanlangan joylardan baʼzilari tizimda topilmadi.',
      });
    }

    // Pricing calculation
    const pricing = calculateBookingSummary(stations, hours);
    const bonusHours = pricing.bonusHours;
    const totalDurationHours = pricing.totalDurationHours;
    const end = new Date(start.getTime() + totalDurationHours * 60 * 60 * 1000);

    // Concurrency check: check if any of the stations collide
    const check = await checkMultipleStationsAvailability(stationIds, start, end);
    if (!check.isAvailable) {
      return res.status(409).json({
        success: false,
        error: 'Tanlangan joylardan baʼzilari ushbu vaqt oraligʻida band!',
        conflicts: check.conflicts,
      });
    }

    // Perform atomic transaction to create reservation and link stations
    let bookingCode = generateBookingCode();
    // Guarantee uniqueness
    while (await prisma.reservation.findUnique({ where: { bookingCode } })) {
      bookingCode = generateBookingCode();
    }

    const now = new Date();
    const isCurrentlyStarting = start <= now && end > now;

    const reservation = await prisma.$transaction(async (tx) => {
      const createdReservation = await tx.reservation.create({
        data: {
          bookingCode,
          customerName,
          customerPhone,
          customerAge,
          startTime: start,
          endTime: end,
          requestedHours: hours,
          bonusHours,
          totalDurationHours,
          totalAmount: pricing.finalPrice,
          discountApplied: pricing.tieredDiscount,
          notes: notes || null,
          status: 'ACTIVE',
        },
      });

      // Link stations
      for (const st of stations) {
        await tx.reservationStation.create({
          data: {
            reservationId: createdReservation.id,
            stationId: st.id,
          },
        });

        // If reservation is starting right now, update station status to OCCUPIED
        if (isCurrentlyStarting && st.status !== 'MAINTENANCE') {
          await tx.station.update({
            where: { id: st.id },
            data: { status: 'OCCUPIED' },
          });
        }
      }

      return createdReservation;
    });

    // Fetch full reservation details to return
    const fullReservation = await prisma.reservation.findUnique({
      where: { id: reservation.id },
      include: {
        stations: {
          include: {
            station: true,
          },
        },
      },
    });

    // Real-time broadcast to all connected WebSocket clients
    broadcastStationReserved({
      reservationId: fullReservation.id,
      bookingCode: fullReservation.bookingCode,
      stationIds: stations.map((s) => s.id),
      stationCodes: stations.map((s) => s.code),
      startTime: fullReservation.startTime,
      endTime: fullReservation.endTime,
      isCurrentlyStarting,
    });

    broadcastReservationCreated(fullReservation);

    res.status(201).json({
      success: true,
      message: 'Muvaffaqiyatli band qilindi!',
      data: {
        reservation: fullReservation,
        pricingSummary: pricing,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel a reservation (Admin or customer lookup)
 */
export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        stations: {
          include: {
            station: true,
          },
        },
      },
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: 'Bron topilmadi.',
      });
    }

    if (reservation.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        error: 'Ushbu bron allaqachon bekor qilingan.',
      });
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        stations: {
          include: {
            station: true,
          },
        },
      },
    });

    // Re-sync live station statuses
    await syncLiveStationStatuses();

    const stationIds = reservation.stations.map((s) => s.stationId);
    broadcastStationReleased({
      reservationId: reservation.id,
      stationIds,
    });

    broadcastReservationCancelled(updated);

    res.json({
      success: true,
      message: 'Bron muvaffaqiyatli bekor qilindi.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single reservation by code or ID
 */
export const getBookingByCode = async (req, res, next) => {
  try {
    const { code } = req.params;

    const reservation = await prisma.reservation.findFirst({
      where: {
        OR: [{ bookingCode: code.toUpperCase() }, { id: code }],
      },
      include: {
        stations: {
          include: {
            station: true,
          },
        },
      },
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: 'Ushbu kod boʻyicha bron topilmadi.',
      });
    }

    res.json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all reservations with optional filters (status, search, stationId)
 */
export const getAllBookings = async (req, res, next) => {
  try {
    const { status, search, limit = 50, page = 1 } = req.query;

    await syncLiveStationStatuses();

    const where = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { bookingCode: { contains: search } },
        { customerName: { contains: search } },
        { customerPhone: { contains: search } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [total, reservations] = await Promise.all([
      prisma.reservation.count({ where }),
      prisma.reservation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit, 10),
        include: {
          stations: {
            include: {
              station: true,
            },
          },
        },
      }),
    ]);

    res.json({
      success: true,
      count: reservations.length,
      total,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
};
