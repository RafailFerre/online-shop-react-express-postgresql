import ApiError from "../error/ApiError.js";
import { Basket, BasketDevice, Device } from "../models/models.js";


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

            // Check if device is already in basket (avoid duplicates)
            const existingDevice = await BasketDevice.findOne({ where: { basketId: basket.id, deviceId } });
            if (existingDevice) {
                return next(ApiError.badRequest('Device is already in basket', { field: 'deviceId' }));
            }

            // Add device to basket
            await BasketDevice.create({ basketId: basket.id, deviceId });

            // Check if user has a basket with devices
            const basketWithDevices = await Basket.findOne({ 
                where: { userId },
                include: [{ 
                    model: BasketDevice, 
                    include: [{ 
                        model: Device, 
                        attributes: ['id', 'name', 'price', 'img', 'brandId', 'typeId'] 
                    }], 
                }],
                order: [[{ model: BasketDevice }, 'createdAt', 'DESC']], // Sort by creation date
             });

            // Extract devices (empty array if none)
            const devices = basketWithDevices.basket_devices.map(bd => bd.device) || [];
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
                        attributes: ['id', 'name', 'price', 'img', 'brandId', 'typeId'] 
                    }], 
                }],
                order: [[{ model: BasketDevice }, 'createdAt', 'DESC']], // Sort by creation date
             });
            if (!basket) {
                return next(ApiError.notFound('Basket not found for user', { field: 'userId' }));
            }

            // Extract devices and return devices in basket
            const devices = basket.basket_devices.map(bd => bd.device);
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

            // Remove device from basket
            await basketDevice.destroy();

            // Check if basket has devices
            const basketWithDevices = await Basket.findOne({ 
                where: { userId },
                include: [{ 
                    model: BasketDevice, 
                    include: [{ 
                        model: Device, 
                        attributes: ['id', 'name', 'price', 'img', 'brandId', 'typeId'] 
                    }], 
                }],
                order: [[{ model: BasketDevice }, 'createdAt', 'DESC']], // Sort by creation date
             });

            // Extract devices (empty array if none)
            const devices = basketWithDevices.basket_devices.map(bd => bd.device) || [];

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

        // Processes checkout by clearing the user's basket
    // Expects: Valid JWT token (via AuthMiddleware)
    // Returns: JSON with success message
    // Throws: ApiError if basket not found or database errors
    async checkout(req, res, next) {
        try {
            const userId = req.user.id;

            // Find user's basket
            const basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                return next(ApiError.notFound('Basket not found for this user'));
            }

            // Check if basket is empty
            const basketDevices = await BasketDevice.findAll({ where: { basketId: basket.id } });
            if (basketDevices.length === 0) {
                return next(ApiError.badRequest('Basket is empty'));
            }

            // Clear basket (delete all BasketDevice records)
            await BasketDevice.destroy({ where: { basketId: basket.id } });

            // Return success message
            return res.json({ message: 'Checkout successful, basket cleared' });
        } catch (error) {
            console.error('Error processing checkout:', error);
            return next(ApiError.internal('Error processing checkout', { details: error.message }));
        }
    }

}


export default new BasketController();