import { Router } from 'express';
import OrderController from '../controllers/orderController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';

const router = new Router();

// Get all orders for the authenticated user
router.get('/', AuthMiddleware, OrderController.getOrders);

// Get all orders (admin only)
router.get('/all', AuthMiddleware, OrderController.getAllOrders);

// Update order status (admin only)
router.put('/status', AuthMiddleware, OrderController.updateOrderStatus);

// Delete an order (admin only)
router.delete('/:id', AuthMiddleware, OrderController.deleteOrder);

export default router;