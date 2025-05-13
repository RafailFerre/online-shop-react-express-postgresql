import { Rating, Device } from '../models/models.js';
import ApiError from '../error/ApiError.js';
// import sequelize from '../config/db.js';


class RatingController {
    // Allows authenticated user to rate a device with optional comment
    // Expects: req.body = { deviceId, rate, comment? }, valid JWT token
    // Returns: JSON with success message and rating details
    async rateDevice(req, res, next) {
        try {
            const { deviceId, rate, comment } = req.body;
            const userId = req.user.id;

            // Validate inputs
            if (!deviceId || typeof deviceId !== 'number' || deviceId <= 0) {
                return next(ApiError.badRequest('Invalid device ID', { field: 'deviceId' }));
            }
            if(!rate || typeof rate !== 'number' || !Number.isInteger(rate) || rate < 1 || rate > 5) {
                return next(ApiError.badRequest('Rate must be a number between 1 and 5', { field: 'rate' }));
            }
            if(comment && typeof comment !== 'string' || comment.length > 500) {
                return next(ApiError.badRequest('Comment must be a string with a maximum length of 500 characters', { field: 'comment' }));
            }

            // Check if device exists
            const device = await Device.findByPk(deviceId);
            if (!device) {
                return next(ApiError.badRequest('Device not found', { field: 'deviceId' }));
            }

            // Check if user already rated this device
            let rating = await Rating.findOne({ where: { deviceId, userId } });

            if (rating) {
                // Update existing rating
                await rating.update({ rate, comment });
            } else {
                // Create new rating
                rating = await Rating.create({ userId, deviceId, rate, comment });
            }

            // Log action
            console.log(`User ${userId} rated device with id ${deviceId} named ${device.name} with rate ${rate}${comment ? ` and comment: ${comment}` : ''}`);

            // Return success response
            return res.json({
                message: `Rating for device with id ${deviceId} updated successfully`,
                deviceName: device.name,
                rating: {
                    userId: rating.userId,
                    deviceId: rating.deviceId,
                    rate: rating.rate,
                    comment: rating.comment,
                    createdAt: rating.createdAt,
                    updatedAt: rating.updatedAt,
                },
            });

        } catch (error) {
            console.error('Error rating device:', error);
            return next(ApiError.internal('Error rating device', { details: error.message }));
        }
    }

  
}

export default new RatingController();