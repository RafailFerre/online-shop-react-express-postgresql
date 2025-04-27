import ApiError from '../error/ApiError.js'; // const ApiError = require('../error/ApiError');
import { Device, DeviceInfo, Rating, BasketDevice, Type, Brand } from '../models/models.js'; // const { Device, DeviceInfo, Rating, BasketDevice, Type, Brand } = require('../models/models');
import upload from '../middleware/UploadHandlingMiddleware.js'; // const upload = require('../middleware/UploadHandlingMiddleware');

// DeviceController manages HTTP requests for device-related operations
class DeviceController {
    // Create a new device with image upload
    async create(req, res, next) {
        

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