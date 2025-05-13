import { Rating, Device, User } from '../models/models.js';
import ApiError from '../error/ApiError.js';
import sequelize from '../config/db.js';


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

    // Retrieves average rating, number of ratings, and ratings list for a device
    // Expects: req.params.deviceId
    // Returns: JSON with average rating, count, and ratings list
    async getDeviceRating(req, res, next) {
        try {
            const deviceId = parseInt(req.params.deviceId, 10);
            if (isNaN(deviceId)) {
                return next(ApiError.badRequest('Invalid deviceId', { field: 'deviceId' }));
            }

            // Check if device exists
            const device = await Device.findByPk(deviceId);
            if (!device) {
                return next(ApiError.notFound(`Device with id ${deviceId} not found`));
            }

            // Get average rating and count
            const [aggregate] = await Rating.findAll({
                where: { deviceId },
                attributes: [
                    [sequelize.fn('AVG', sequelize.col('rate')), 'averageRating'],
                    [sequelize.fn('COUNT', sequelize.col('rating.id')), 'ratingCount'],
                ],
                raw: true, // Return plain object for aggregates
            });

            // Get individual ratings with user details
            const ratings = await Rating.findAll({
                where: { deviceId },
                include: [{ model: User, attributes: ['id', 'email'] }],
                attributes: ['id', 'userId', 'deviceId', 'rate', 'comment', 'createdAt', 'updatedAt'],
            });

            // Extract average rating and count
            const averageRating = aggregate && aggregate.averageRating ? parseFloat(aggregate.averageRating) : 0;
            const ratingCount = aggregate && aggregate.ratingCount ? parseInt(aggregate.ratingCount, 10) : 0;

            // Format ratings list
            const ratingsList = ratings.map(rating => ({
                id: rating.id,
                user: {
                    id: rating.user.id,
                    email: rating.user.email,
                },
                rate: rating.rate,
                comment: rating.comment,
                createdAt: rating.createdAt,
                updatedAt: rating.updatedAt,
            }));

            // Return response
            return res.json({
                deviceId,
                deviceName: device.name,
                averageRating: averageRating.toFixed(1), // Round to 1 decimal place
                ratingCount,
                ratings: ratingsList,
            });
        } catch (error) {
            console.error('Error retrieving device rating:', error);
            return next(ApiError.internal('Error retrieving device rating', { details: error.message }));
        }
    }

    // Deletes a rating (admin can delete any, user only their own)
    // Expects: req.params.ratingId, valid JWT token
    // Returns: JSON with success message
    async deleteRating(req, res, next) {
        try {
            const ratingId = parseInt(req.params.ratingId, 10);
            const userId = req.user.id;
            const isAdmin = req.user.role === 'ADMIN';

            // Validate input
            if (isNaN(ratingId)) {
                return next(ApiError.badRequest('Invalid ratingId', { field: 'ratingId' }));
            }

            // Find rating
            const rating = await Rating.findByPk(ratingId);
            if (!rating) {
                return next(ApiError.notFound(`Rating with id ${ratingId} not found`));
            }

            // Check permissions
            if (!isAdmin && rating.userId !== userId) {
                return next(ApiError.forbidden('You can only delete your own ratings'));
            }

            // Delete rating
            await rating.destroy();

            // Log action
            console.log(`${isAdmin ? 'Admin' : 'User'} ${userId} deleted rating ${ratingId}`);

            // Return success response
            return res.json({
                message: `Rating ${ratingId} deleted successfully`,
            });
        } catch (error) {
            console.error('Error deleting rating:', error);
            return next(ApiError.internal('Error deleting rating', { details: error.message }));
        }
    }
}

export default new RatingController();