import ApiError from '../error/ApiError.js'; // const ApiError = require('../error/ApiError');
import { Device, DeviceInfo, Rating, BasketDevice, Type, Brand } from '../models/models.js'; // const { Device, DeviceInfo, Rating, BasketDevice, Type, Brand } = require('../models/models');
import upload from '../middleware/UploadHandlingMiddleware.js'; // const upload = require('../middleware/UploadHandlingMiddleware');

// DeviceController manages HTTP requests for device-related operations
class DeviceController {
    // Create a new device with image upload
    async create(req, res, next) {
        upload(req, res, async (err) => {
            try {
                // Log request data for debugging
                console.log('Create device request:', { body: req.body, file: req.file });
                // Handle any errors from middleware
                if (err) {
                    return next(err);
                }

                // Extract device data from request body
                const { name, price, rating, typeId, brandId, info } = req.body;

                // Validate: Ensure name is a non-empty string
                if (!name || typeof name !== 'string' || name.trim() === '') {
                    return next(ApiError.badRequest('Device name is required and must be a non-empty string', { field: 'name', issue: 'required' }));
                }

                // Validate: price must be a positive number
                if (!price || isNaN(price) || parseInt(price) <= 0) {
                    return next(ApiError.badRequest('Price must be a positive number', { field: 'price', issue: 'invalid' }));
                }

                // Validate: file is required
                if (!req.file) {
                    return next(ApiError.badRequest('Image is required', { field: 'img', issue: 'required' }));
                }

                // Create new device in the database
                const device = await Device.create({
                    name: name.trim(),
                    price: parseInt(price),
                    typeId: parseInt(typeId),
                    brandId: parseInt(brandId),
                    img: `images/${req.file.filename}`, // Store relative path to image
                });

                // Return created device
                return res.json(device);
            } catch (error) {
                // Log full error details for debugging
                console.error('Error in create device:', error);
                return next(ApiError.internal('Error creating device', { details: error.message }));
            }
        })
    }

    // Retrieve a single device by ID
    async getOne(req, res, next) {

    }

    // Retrieve all devices with optional filtering
    async getAll(req, res, next) {

    }

    // Update an existing device
    async update(req, res, next) {

    }

    // Delete a device and its related data
    async delete(req, res, next) {

    }
}

export default new DeviceController();