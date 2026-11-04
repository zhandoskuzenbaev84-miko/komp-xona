import prisma from '../config/db.js';

export const getAllGames = async (req, res, next) => {
  try {
    const { platform, genre, search, popularOnly } = req.query;

    const where = {};

    if (platform && platform !== 'ALL') {
      where.OR = [
        { platform: platform.toUpperCase() },
        { platform: 'BOTH' },
      ];
    }

    if (genre && genre !== 'ALL') {
      where.genre = { contains: genre };
    }

    if (popularOnly === 'true') {
      where.isPopular = true;
    }

    if (search) {
      where.OR = [
        ...(where.OR || []),
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const games = await prisma.game.findMany({
      where,
      orderBy: [{ isPopular: 'desc' }, { title: 'asc' }],
    });

    res.json({
      success: true,
      count: games.length,
      data: games,
    });
  } catch (error) {
    next(error);
  }
};

export const getGameById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const game = await prisma.game.findUnique({
      where: { id },
    });

    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Oʻyin topilmadi.',
      });
    }

    res.json({
      success: true,
      data: game,
    });
  } catch (error) {
    next(error);
  }
};

export const getGameCategories = async (req, res, next) => {
  try {
    const genres = [
      'ALL',
      'FPS / Shooter',
      'MOBA',
      'Sports & Football',
      'Action & Story',
      'Racing & Simulator',
      'Fighting',
      'Battle Royale',
    ];

    const platforms = ['ALL', 'PC', 'PS5', 'BOTH'];

    res.json({
      success: true,
      genres,
      platforms,
    });
  } catch (error) {
    next(error);
  }
};
