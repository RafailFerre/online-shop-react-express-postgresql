import { Order, OrderDevice, Device, User } from '../models/models.js';
import ApiError from '../error/ApiError.js';

class OrderController {
    // Retrieves all orders for the authenticated user
    // Expects: Valid JWT token (via AuthMiddleware)
    async getOrders(req, res, next) {
        try {
            const userId = req.user.id;

            // Find user's orders
            const orders = await Order.findAll({
                where: { userId },
                include: [{
                    model: OrderDevice,
                    include: [{
                        model: Device,
                        attributes: ['id', 'name', 'price', 'img'],
                    }],
                }],
                order: [['createdAt', 'DESC']], // Newest orders first
            });

            // Format response
            const formattedOrders = orders.map(order => ({
                id: order.id,
                total: order.total,
                address: order.address,
                status: order.status,
                createdAt: order.createdAt,
                devices: order.order_devices.map(od => ({
                    id: od.device.id,
                    name: od.device.name,
                    price: od.device.price,
                    img: od.device.img,
                    quantity: od.quantity,
                })),
            }));

            return res.json(formattedOrders);
        } catch (error) {
            console.error('Error retrieving user orders:', error);
            return next(ApiError.internal('Error retrieving orders', { details: error.message }));
        }
    }

    // Retrieves all orders (admin only)
    // Expects: Valid JWT token with role 'ADMIN' (via AuthMiddleware)
    // Returns: JSON array of all orders with user and device details
    async getAllOrders(req, res, next) {
        try {
            // Check if user is admin
            if (req.user.role !== 'ADMIN') {
                return next(ApiError.forbidden('Access denied: Admin only'));
            }

            // Find all orders
            const orders = await Order.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['id', 'email'],
                    },
                    {
                        model: OrderDevice,
                        include: [{
                            model: Device,
                            attributes: ['id', 'name', 'price', 'img'],
                        }],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });

            // Format response
            const formattedOrders = orders.map(order => ({
                id: order.id,
                user: {
                    id: order.user.id,
                    email: order.user.email,
                },
                total: order.total,
                address: order.address,
                status: order.status,
                createdAt: order.createdAt,
                devices: order.order_devices.map(od => ({
                    id: od.device.id,
                    name: od.device.name,
                    price: od.device.price,
                    img: od.device.img,
                    quantity: od.quantity,
                })),
            }));

            return res.json(formattedOrders);
        } catch (error) {
            console.error('Error retrieving all orders:', error);
            return next(ApiError.internal('Error retrieving all orders', { details: error.message }));
        }
    }

    // Updates order status by ID (admin only)
    // Expects: req.body = { orderId, status }, valid JWT token with role 'ADMIN' (via AuthMiddleware)
    async updateOrderStatus(req, res, next) {
        try {
            // Check if user is admin
            if (req.user.role !== 'ADMIN') {
                return next(ApiError.forbidden('Access denied: Admin only'));
            }

            // Extract orderId and status from request body
            const { orderId, status } = req.body;

            // Validate inputs orderId
            if(!orderId || typeof orderId !== 'number' || orderId <= 0) {
                return next(ApiError.badRequest('Invalid order ID', { field: 'orderId' }));
            }

            // Validate inputs status
            const validStatuses = ['pending', 'shipped', 'delivered'];            
            if(!status || !validStatuses.includes(status)) {
                return next(ApiError.badRequest(`Status must be one of ${validStatuses.join(', ')}`, { field: 'status' }));
            }

            // Find order by ID
            const order = await Order.findByPk(orderId);
            if (!order) {
                return next(ApiError.notFound(`Order with ID ${orderId} not found`));
            }

            // Update order status
            await order.update({ status });
            
            // Log action
            console.log(`Admin ${req.user.id} updated order ${orderId} status to ${status}`);

            // Return updated order
            return res.json({
                message: `Order ${orderId} status updated to ${status}`,
                order: {
                    id: order.id,
                    total: order.total,
                    address: order.address,
                    status: order.status,
                    createdAt: order.createdAt,
                }
            });
    } catch (error) {
            console.error('Error updating order status:', error);
            return next(ApiError.internal('Error updating order status', { details: error.message }));
        }
    }

}

export default new OrderController();