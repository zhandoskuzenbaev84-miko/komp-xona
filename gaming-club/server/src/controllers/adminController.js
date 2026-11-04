import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { syncLiveStationStatuses } from '../services/collisionService.js';
import { broadcastStationStatusUpdated } from '../config/socket.js';

/**
 * Admin Login
 */
export const adminLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Login va parolni kiriting.',
      });
    }

    const admin = await prisma.admin.findFirst({
      where: {
        OR: [{ username }, { email: username }],
      },
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Login yoki parol notoʻgʻri.',
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Login yoki parol notoʻgʻri.',
      });
    }

    const secret = process.env.JWT_SECRET || 'cyberclub_super_secure_jwt_secret_key_2026_uzbekistan';
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Admin tizimga muvaffaqiyatli kirdi.',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Dashboard Live Summary & Statistics
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    await syncLiveStationStatuses();

    const stations = await prisma.station.findMany({
      orderBy: { code: 'asc' },
    });

    const pcStations = stations.filter((s) => s.type === 'PC');
    const psStations = stations.filter((s) => s.type === 'PS5');

    const totalStations = stations.length;
    const occupiedStations = stations.filter((s) => s.status === 'OCCUPIED').length;
    const availableStations = stations.filter((s) => s.status === 'AVAILABLE').length;
    const maintenanceStations = stations.filter((s) => s.status === 'MAINTENANCE').length;

    // Today's metrics (midnight to now)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayReservations = await prisma.reservation.findMany({
      where: {
        createdAt: { gte: todayStart },
        status: { in: ['ACTIVE', 'COMPLETED'] },
      },
    });

    const todayRevenue = todayReservations.reduce((sum, r) => sum + r.totalAmount, 0);
    const todayDiscountTotal = todayReservations.reduce((sum, r) => sum + r.discountApplied, 0);

    // Active ongoing reservations
    const now = new Date();
    const activeOngoingReservations = await prisma.reservation.findMany({
      where: {
        status: 'ACTIVE',
        startTime: { lte: now },
        endTime: { gt: now },
      },
      include: {
        stations: {
          include: {
            station: true,
          },
        },
      },
    });

    res.json({
      success: true,
      stats: {
        stations: {
          total: totalStations,
          pcTotal: pcStations.length,
          psTotal: psStations.length,
          occupied: occupiedStations,
          available: availableStations,
          maintenance: maintenanceStations,
          occupancyRate: totalStations ? Math.round((occupiedStations / totalStations) * 100) : 0,
        },
        financials: {
          todayRevenue,
          todayDiscountTotal,
          todayBookingsCount: todayReservations.length,
        },
        activeOngoingCount: activeOngoingReservations.length,
      },
      stations,
      activeOngoingReservations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin quick action: Toggle maintenance lock on station
 */
export const toggleStationMaintenance = async (req, res, next) => {
  try {
    const { id } = req.params;

    const station = await prisma.station.findUnique({ where: { id } });
    if (!station) {
      return res.status(404).json({ success: false, error: 'Station topilmadi.' });
    }

    const nextStatus = station.status === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE';

    const updated = await prisma.station.update({
      where: { id },
      data: { status: nextStatus },
    });

    broadcastStationStatusUpdated({
      stationId: updated.id,
      stationCode: updated.code,
      status: updated.status,
    });

    res.json({
      success: true,
      message: `${station.code} holati oʻzgartirildi: ${nextStatus}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
