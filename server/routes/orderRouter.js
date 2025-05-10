import { Router } from 'express';
import OrderController from '../controllers/orderController.js';
import authMiddleware from '../middleware/AuthMiddleware.js';

const router = new Router();

router.get('/', authMiddleware, OrderController.getOrders);
router.get('/all', authMiddleware, OrderController.getAllOrders);

export default router;