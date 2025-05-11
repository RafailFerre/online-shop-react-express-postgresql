import { Router } from 'express';
import OrderController from '../controllers/orderController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';

const router = new Router();

router.get('/', AuthMiddleware, OrderController.getOrders); // Get user orders

router.get('/all', AuthMiddleware, OrderController.getAllOrders); // Get all orders

// router.delete('/:id', AuthMiddleware, OrderController.deleteOrder); // Delete order

export default router;