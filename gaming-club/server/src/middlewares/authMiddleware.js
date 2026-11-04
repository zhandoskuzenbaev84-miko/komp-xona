import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

export const verifyAdminToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Avtorizatsiya talab qilinadi. Token topilmadi.',
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'cyberclub_super_secure_jwt_secret_key_2026_uzbekistan';

    const decoded = jwt.verify(token, secret);
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true, email: true, role: true },
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Yaroqsiz token yoki foydalanuvchi mavjud emas.',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token muddati tugagan yoki notoʻgʻri.',
      details: error.message,
    });
  }
};
