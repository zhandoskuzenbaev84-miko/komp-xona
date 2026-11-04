import { Router } from 'express';
import {
  getAllGames,
  getGameById,
  getGameCategories,
} from '../controllers/gameController.js';

const router = Router();

router.get('/', getAllGames);
router.get('/categories', getGameCategories);
router.get('/:id', getGameById);

export default router;
