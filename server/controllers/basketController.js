import ApiError from "../error/ApiError.js";
import { Basket, BasketDevice, Device, Type, Brand, Order, OrderDevice } from "../models/models.js";


class BasketController {
    // Adds a device to the user's basket
    // Expects: req.body = { deviceId }, valid JWT token (via AuthMiddleware)
    // Returns: JSON with created BasketDevice record
    async addDevice(req, res, next) {
        try {
            const { deviceId } = req.body; // Extract device ID from request body

            const userId = req.user.id; // Get the user ID from the request

            // Validate: Ensure device ID is a positive integer
            if (!deviceId || isNaN(deviceId) || parseInt(deviceId) <= 0) {
                return next(ApiError.badRequest('Invalid device ID', { field: 'deviceId' }));
            }

            // Check if user has a basket
            const basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                return next(ApiError.notFound('Basket not found for user', { field: 'userId' }));
            }

            // Check if device exists
            const device = await Device.findByPk(deviceId);
            if (!device) {
                return next(ApiError.notFound('Device not found', { field: 'deviceId' }));
            }

            // Check if device is already in basket then increment quantity by 1 else create basketDevice
            const existingDevice = await BasketDevice.findOne({ where: { basketId: basket.id, deviceId } });
            if (existingDevice) {
                await existingDevice.update({ quantity: existingDevice.quantity + 1 });
                // Return updated basket
            } else {
                await BasketDevice.create({ basketId: basket.id, deviceId });
            }

            // Check if device is already in basket (avoid duplicates)
            // if (existingDevice) {
            //     return next(ApiError.badRequest('Device is already in basket', { field: 'deviceId' }));
            // }

            // // Add device to basket
            // await BasketDevice.create({ basketId: basket.id, deviceId });

            // Check if user has a basket with devices
            const basketWithDevices = await Basket.findOne({ 
                where: { userId },
                include: [{ 
                    model: BasketDevice, 
                    include: [{ 
                        model: Device, 
                        attributes: ['id', 'name', 'price', 'img'],
                        include: [
                            { model: Brand, attributes: ['name'] },
                            { model: Type, attributes: ['name'] },
                        ],
                    }], 
                }],
                order: [[{ model: BasketDevice }, 'createdAt', 'DESC']], // Sort by creation date
             });

            // Extract devices with quantity
            const devices = basketWithDevices.basket_devices.map(bd => ({ ...bd.device.toJSON(), quantity: bd.quantity, }));

            // Extract devices (empty array if none)
            // const devices = basketWithDevices.basket_devices.map(bd => bd.device) || [];
            // const devices = basketWithDevices?.basket_devices?.map(bd => bd.device) || [];  --> ?. is the optional chaining operator, which returns undefined if the preceding value is null or undefined, rather than throwing an error.
            // const devices = basketWithDevices && basketWithDevices.basket_devices ? basketWithDevices.basket_devices.map(bd => bd.device) : [];

            // Return success message with device name and updated devices
            return res.json({ 
                message: `Device ${device.name} added to basket`,
                devices,
             });
        } catch (error) {
            console.error('Error adding device to basket:', error);
            return next(ApiError.internal('Internal server error', { details: error.message }));
        }
    }

    // Retrieves the contents of the user's basket
    async getBasket(req, res, next) {
        try {
            const userId = req.user.id; // Get the user ID from the request

            // Check if user has a basket
            const basket = await Basket.findOne({ 
                where: { userId },
                include: [{ 
                    model: BasketDevice, 
                    include: [{ 
                        model: Device, 
                        attributes: ['id', 'name', 'price', 'img'],
                        include: [
                            { model: Brand, attributes: ['name'] },
                            { model: Type, attributes: ['name'] },
                        ],
                    }], 
                }],
                order: [[{ model: BasketDevice }, 'createdAt', 'DESC']], // Sort by creation date
             });
            if (!basket) {
                return next(ApiError.notFound('Basket not found for user', { field: 'userId' }));
            }

            // Extract devices with quantity
            const devices = basket.basket_devices.map(bd => ({ ...bd.device.toJSON(), quantity: bd.quantity, }));

            // Extract devices and return devices in basket
            // const devices = basket.basket_devices.map(bd => bd.device);
            return res.json(devices);
        } catch (error) {
            console.error('Error retrieving basket:', error);
            return next(ApiError.internal('Internal server error', { details: error.message }));
        }
    }

    async removeDevice(req, res, next) {
        try {
            const { deviceId } = req.params; // Extract device ID from request parameters

            const userId = req.user.id; // Get the user ID from the request

            // Validate: Ensure device ID is a positive integer
            if (!deviceId || isNaN(deviceId) || parseInt(deviceId) <= 0) {
                return next(ApiError.badRequest('Invalid device ID', { field: 'deviceId' }));
            }

            // Check if user has a basket
            const basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                return next(ApiError.notFound('Basket not found for user', { field: 'userId' }));
            }

            // Check if device is in basket
            const basketDevice = await BasketDevice.findOne({ 
                where: { basketId: basket.id, deviceId }, 
                include: [{
                    model: Device,
                    attributes: ['name'], // Only need name for message
                }],
            });
            if (!basketDevice) {
                return next(ApiError.notFound('Device not found in basket'));
            }

            // Store device name before deletion
            const deviceName = basketDevice.device.name;

            // Decrease quantity or remove device
            if (basketDevice.quantity > 1) {
                await basketDevice.update({ quantity: basketDevice.quantity - 1 });
            } else {
                await basketDevice.destroy();
            }

            // // Remove device from basket fully with all quantity
            // await basketDevice.destroy();

            // Check if basket has devices
            const basketWithDevices = await Basket.findOne({ 
                where: { userId },
                include: [{ 
                    model: BasketDevice, 
                    include: [{ 
                        model: Device, 
                        attributes: ['id', 'name', 'price', 'img'],
                        include: [
                            { model: Brand, attributes: ['name'] },
                            { model: Type, attributes: ['name'] },
                        ],
                    }], 
                }],
                order: [[{ model: BasketDevice }, 'createdAt', 'DESC']], // Sort by creation date
             });

            // Extract devices with quantity
            const devices = basketWithDevices.basket_devices.map(bd => ({ ...bd.device.toJSON(), quantity: bd.quantity, }));

            // Extract devices (empty array if none)
            // const devices = basketWithDevices.basket_devices.map(bd => bd.device) || [];
            // const devices = basketWithDevices?.basket_devices?.map(bd => bd.device) || [];  --> ?. is the optional chaining operator, which returns undefined if the preceding value is null or undefined, rather than throwing an error.
            // const devices = basketWithDevices && basketWithDevices.basket_devices ? basketWithDevices.basket_devices.map(bd => bd.device) : [];

            // Return success message with removed device name and remaining devices
            return res.json({ 
                message: `Device ${deviceName} removed from basket`,
                devices,
             });
        } catch (error) {
            console.error('Error removing device from basket:', error);
            return next(ApiError.internal('Internal server error', { details: error.message }));
        }
    }

    // Processes checkout by creating an order and clearing the user's basket
    // Expects: req.body = { address }, valid JWT token (via AuthMiddleware)
    async checkout(req, res, next) {
        try {
            const { address } = req.body; // Extract address from request body
            const userId = req.user.id; // Get the user ID from the request

            // Validate address
            if (!address || typeof address !== 'string' || address.trim().length < 5) {
                return next(ApiError.badRequest('Invalid delivery address', { field: 'address' }));
            }

            // Find user's basket
            const basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                return next(ApiError.notFound('Basket not found for this user'));
            }

            // Get basket devices with full device details
            const basketDevices = await BasketDevice.findAll({
                where: { basketId: basket.id },
                include: [{
                    model: Device,
                    attributes: ['id', 'name', 'price', 'img'],
                }],
            });
            if (basketDevices.length === 0) {
                return next(ApiError.badRequest('Basket is empty'));
            }

            // Calculate total amount
            const total = basketDevices.reduce((sum, bd) => {
                return sum + bd.device.price * bd.quantity;
            }, 0);

            // Create order
            const order = await Order.create({
                userId,
                total,
                address: address.trim(),
                status: 'pending',
            });

            // Create order devices
            const orderDevices = basketDevices.map(bd => ({
                orderId: order.id,
                deviceId: bd.deviceId,
                quantity: bd.quantity,
            }));
            await OrderDevice.bulkCreate(orderDevices);

            // Clear basket
            await BasketDevice.destroy({ where: { basketId: basket.id } });

            // Prepare response with order details
            const devices = basketDevices.map(bd => ({
                id: bd.device.id,
                name: bd.device.name,
                price: bd.device.price,
                img: bd.device.img,
                quantity: bd.quantity,
            }));

            return res.json({
                message: 'Checkout successful, order created',
                order: {
                    id: order.id,
                    total: order.total,
                    address: order.address,
                    status: order.status,
                    createdAt: order.createdAt,
                    devices,
                },
            });
        } catch (error) {
            console.error('Error processing checkout:', error);
            return next(ApiError.internal('Error processing checkout', { details: error.message }));
        }
    }

}


export default new BasketController();