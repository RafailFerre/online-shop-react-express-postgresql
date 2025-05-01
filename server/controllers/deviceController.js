import ApiError from '../error/ApiError.js';  // const ApiError = require('../error/ApiError');
import { Device, DeviceInfo, Rating, BasketDevice, Type, Brand } from '../models/models.js';  // const { Device, DeviceInfo, Rating, BasketDevice, Type, Brand } = require('../models/models');
import upload from '../middleware/UploadMiddleware.js'; // const upload = require('../middleware/UploadHandlingMiddleware');
import fs from 'fs/promises'; // const fs = require('fs/promises'); for file operations async/await: delete file image after upload from server (folder static/images) if there is an error and when delete device
import path from 'path'; // const path = require('path');
import { fileURLToPath } from 'url'; // const { fileURLToPath } = require('url');

// Resolve __dirname for ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

                // Extract data from request body
                const { name, price, typeId, brandId, info } = req.body;

                // Validate: Ensure required fields are provided
                if (!name || typeof name !== 'string' || name.trim() === '') {
                    // Delete uploaded file if validation fails
                    if (req.file) {
                        await fs.unlink(req.file.path);
                    }
                    return next(ApiError.badRequest('Device name is required and must be a non-empty string', { field: 'name' }));
                }
                if (!price || isNaN(price) || parseInt(price) <= 0) {
                    // Delete uploaded file if validation fails
                    if (req.file) {
                        await fs.unlink(req.file.path);
                    }
                    return next(ApiError.badRequest('Price must be a positive number', { field: 'price' }));
                }
                if (!typeId || isNaN(typeId) || parseInt(typeId) <= 0) {
                    // Delete uploaded file if validation fails
                    if (req.file) {
                        await fs.unlink(req.file.path);
                    }
                    return next(ApiError.badRequest('Invalid type ID', { field: 'typeId' }));
                }
                if (!brandId || isNaN(brandId) || parseInt(brandId) <= 0) {
                    // Delete uploaded file if validation fails
                    if (req.file) {
                        await fs.unlink(req.file.path);
                    }
                    return next(ApiError.badRequest('Invalid brand ID', { field: 'brandId' }));
                }
                if (!req.file) {
                    return next(ApiError.badRequest('Image is required', { field: 'img' }));
                }

                // Validate: Check if device name is unique
                const existingDevice = await Device.findOne({ where: { name } });
                if (existingDevice) {
                    // Delete uploaded file if validation fails
                    if (req.file) {
                        await fs.unlink(req.file.path);
                    }
                    return next(ApiError.badRequest('Device with this name already exists', { field: 'name', issue: 'duplicate' }));
                }

                // Validate: Check if type and brand exist
                const type = await Type.findByPk(typeId);
                const brand = await Brand.findByPk(brandId);
                if (!type || !brand) {
                    // Delete uploaded file if validation fails
                    if (req.file) {
                        await fs.unlink(req.file.path);
                    }
                    return next(ApiError.notFound('Type or brand not found', { field: 'typeId', issue: 'not found' }, { field: 'brandId', issue: 'not found' }));
                }

                // Create device
                const device = await Device.create({
                    name: name.trim(),
                    price: parseInt(price),
                    typeId: parseInt(typeId),
                    brandId: parseInt(brandId),
                    img: `images/${req.file.filename}`, // Store relative path
                });

                // Process device info if provided
                if (info) {
                    let infoArray;
                    try {
                        infoArray = JSON.parse(info); // Parse info as JSON
                    } catch (parseError) {
                        return next(ApiError.badRequest('Invalid JSON format in info field', { field: 'info', issue: parseError.message }));
                    }
                    if (!Array.isArray(infoArray)) {
                        return next(ApiError.badRequest('Info must be an array', { field: 'info' }));
                    }
                    for (const item of infoArray) {
                        if (!item.title || !item.description) {
                            return next(ApiError.badRequest('Device info must have title and description', { field: 'info' }));
                        }
                        await DeviceInfo.create({
                            title: item.title,
                            description: item.description,
                            deviceId: device.id,
                        });
                    }
                }

                // Return the status code and created device
                return res.status(201).json(device);

            } catch (error) {
                // Delete uploaded file if there is an error
                if (req.file) {
                    await fs.unlink(req.file.path);
                }
                // Log full error details for debugging
                console.error('Error in create device:', error);
                return next(ApiError.internal('Error creating device', { details: error.message }));
            }
        });
    }

    // Retrieve a single device by ID
    async getOne(req, res, next) {
        try {
            // Extract ID from request parameters
            const { id } = req.params;

            // Validate: Ensure ID is a positive integer
            if (!id || isNaN(id) || parseInt(id) <= 0) {
                return next(ApiError.badRequest('Invalid device ID', { field: 'id' }));
            }

            // Find device with related data
            const device = await Device.findByPk(id, {
                include: [
                    { model: Type, attributes: ['id', 'name'] },
                    { model: Brand, attributes: ['id', 'name'] },
                    { model: DeviceInfo, as: 'device_infos' }, // Alias from DeviceInfo model
                ],
            });

            // Check if device exists
            if (!device) {
                return next(ApiError.notFound('Device not found', { field: 'id' }));
            }

            // Return device as JSON
            return res.json(device);
        } catch (error) {
            // Log full error details for debugging
            console.error('Error in getOne device:', error);
            return next(ApiError.internal('Error fetching device', { details: error.message }));
        }
    }

    // Retrieve all devices with optional filtering
    async getAll(req, res, next) {
        try {
            // Extract query parameters for filtering
            const { typeId, brandId, limit = 10, page = 1 } = req.query;

            // Prepare query conditions
            const where = {};
            if (typeId && !isNaN(typeId)) {
                where.typeId = parseInt(typeId);
            }
            if (brandId && !isNaN(brandId)) {
                where.brandId = parseInt(brandId);
            }

            // Validate: Ensure limit and page are positive integers
            if (isNaN(limit) || parseInt(limit) <= 0) {
                return next(ApiError.badRequest('Invalid limit value', { field: 'limit' }));
            }
            if (isNaN(page) || parseInt(page) <= 0) {
                return next(ApiError.badRequest('Invalid page value', { field: 'page' }));
            }

            // Calculate offset for pagination
            const offset = (parseInt(page) - 1) * parseInt(limit);

            // Fetch devices with pagination and related data
            const devices = await Device.findAndCountAll({
                where,
                include: [
                    { model: Type, attributes: ['id', 'name'] },
                    { model: Brand, attributes: ['id', 'name'] },
                    { model: DeviceInfo, as: 'device_infos' }, // Use correct alias
                ],
                limit: parseInt(limit),
                offset,
            });

            // Return devices with pagination info
            return res.json({
                count: devices.count,
                rows: devices.rows,
            });
        } catch (error) {
            // Log full error details for debugging
            console.error('Error in getAll devices:', error);
            return next(ApiError.internal('Error fetching devices', { details: error.message }));
        }
    }

    // Update an existing device
    async update(req, res, next) {
        upload(req, res, async (err) => {
            try {
                // Log request data for debugging
                console.log('Update device request:', { params: req.params, body: req.body, file: req.file });

                // Handle any errors from multer
                if (err) {
                    return next(err);
                }

                // Extract ID from request parameters
                const { id } = req.params;

                // Validate: Ensure ID is a positive integer
                if (!id || isNaN(id) || parseInt(id) <= 0) {
                    if (req.file) {
                        await fs.unlink(req.file.path);
                    }
                    return next(ApiError.badRequest('Invalid device ID', { field: 'id' }));
                }

                // Find existing device
                const device = await Device.findByPk(id);
                if (!device) {
                    if (req.file) {
                        await fs.unlink(req.file.path);
                    }
                    return next(ApiError.notFound('Device not found', { field: 'id' }));
                }

                // Extract data from request body
                const { name, price, typeId, brandId, info } = req.body;

                // Validate input data (only if provided)
                if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
                    if (req.file) {
                        await fs.unlink(req.file.path);
                    }
                    return next(ApiError.badRequest('Device name must be a non-empty string', { field: 'name' }));
                }
                if (price !== undefined && (isNaN(price) || parseInt(price) <= 0)) {
                    if (req.file) {
                        await fs.unlink(req.file.path);
                    }
                    return next(ApiError.badRequest('Price must be a positive number', { field: 'price' }));
                }
                if (typeId !== undefined && (isNaN(typeId) || parseInt(typeId) <= 0)) {
                    if (req.file) {
                        await fs.unlink(req.file.path);
                    }
                    return next(ApiError.badRequest('Type ID must be a positive number', { field: 'typeId' }));
                }
                if (brandId !== undefined && (isNaN(brandId) || parseInt(brandId) <= 0)) {
                    if (req.file) {
                        await fs.unlink(req.file.path);
                    }
                    return next(ApiError.badRequest('Brand ID must be a positive number', { field: 'brandId' }));
                }

                // Prepare update data
                const updateData = {};
                if (name !== undefined) updateData.name = name.trim();
                if (price !== undefined) updateData.price = parseInt(price);
                if (typeId !== undefined) updateData.typeId = parseInt(typeId);
                if (brandId !== undefined) updateData.brandId = parseInt(brandId);

                // Handle image update
                let oldImagePath = null;
                if (req.file) {
                    // Store path of old image for deletion
                    if (device.img) {
                        oldImagePath = path.normalize(path.join(__dirname, '../static/', device.img));
                    }
                    updateData.img = `images/${req.file.filename}`;
                }

                // Parse and validate info if provided
                let deviceInfo = [];
                if (info) {
                    try {
                        deviceInfo = JSON.parse(info);
                        if (!Array.isArray(deviceInfo)) {
                            if (req.file) {
                                await fs.unlink(req.file.path);
                            }
                            return next(ApiError.badRequest('Info must be a JSON array', { field: 'info' }));
                        }
                        for (const item of deviceInfo) {
                            if (!item.title || !item.description || typeof item.title !== 'string' || typeof item.description !== 'string') {
                                if (req.file) {
                                    await fs.unlink(req.file.path);
                                }
                                return next(ApiError.badRequest('Each info item must have valid title and description', { field: 'info' }));
                            }
                        }
                    } catch (e) {
                        if (req.file) {
                            await fs.unlink(req.file.path);
                        }
                        return next(ApiError.badRequest('Invalid JSON format for info', { field: 'info' }, e));
                    }
                }

                // Update device
                await device.update(updateData);

                // Update device info if provided
                if (deviceInfo.length > 0) {
                    // Delete existing device info
                    await DeviceInfo.destroy({ where: { deviceId: id } });
                    // Create new device info
                    await DeviceInfo.bulkCreate(
                        deviceInfo.map((item) => ({
                            title: item.title,
                            description: item.description,
                            deviceId: id,
                        }))
                    );
                }

                // Delete old image if a new one was uploaded and file exists
                if (oldImagePath) {
                    try {
                        await fs.unlink(oldImagePath);
                        // console.log('Old image deleted:', oldImagePath);
                    } catch (e) {
                            console.error('Failed to delete old image:', e);
                    }
                }

                // Fetch updated device with related data
                const updatedDevice = await Device.findByPk(id, {
                    include: [
                        { model: Type, attributes: ['id', 'name'] },
                        { model: Brand, attributes: ['id', 'name'] },
                        { model: DeviceInfo, as: 'device_infos' },
                    ],
                });

                // Return updated device
                return res.json(updatedDevice);
            } catch (error) {
                // Delete uploaded file if an error occurs
                if (req.file) {
                    await fs.unlink(req.file.path);
                }
                // Log full error details for debugging
                console.error('Error in update device:', error);
                return next(ApiError.internal('Error updating device', { details: error.message }));
            }
        });
    }

    // Delete a device and its related data
    async delete(req, res, next) {
        try {
            // Extract ID from request parameters
            const { id } = req.params;

            // Validate: Ensure ID is a positive integer
            if (!id || isNaN(id) || parseInt(id) <= 0) {
                return next(ApiError.badRequest('Invalid device ID', { field: 'id' }));
            }

            // Check if device exists
            const device = await Device.findByPk(id);
            if (!device) {
                return next(ApiError.notFound('Device not found', { field: 'id' }));
            }

            // Handle image for deletion
            let imagePath = null;
            if (req.file) {
                // Store path of old image for deletion
                if (device.img) {
                    imagePath = path.normalize(path.join(__dirname, '../static/', device.img));
                }
            }

            // Delete related data and device
            await Promise.all([
                await DeviceInfo.destroy({ where: { deviceId: id } }),
                await Rating.destroy({ where: { deviceId: id } }),
                await BasketDevice.destroy({ where: { deviceId: id } }),
                await Device.destroy({ where: { id } })
            ]);

            // Delete old image if device was deleted
            if (imagePath) {
                try {
                    await fs.unlink(imagePath);
                    // console.log('Old image deleted:', oldImagePath);
                } catch (e) {
                        console.error('Failed to delete image:', e);
                }
            }

            // Return success message
            return res.json({ message: 'Device deleted successfully' });
        } catch (error) {
            // Log full error details for debugging
            console.error('Error in delete device:', error);
            return next(ApiError.internal('Error deleting device', { details: error.message }));
        }
    }
}

export default new DeviceController();