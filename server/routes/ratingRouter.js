import express from 'express';
const router = express.Router();
import RatingController from '../controllers/ratingController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';

// Rate a device (authenticated users only)
router.post('/', AuthMiddleware, RatingController.rateDevice);

// // Get average rating and ratings list for a device
// router.get('/:deviceId', RatingController.getDeviceRating);

// // Delete a rating (authenticated users or admins)
// router.delete('/:ratingId', AuthMiddleware, RatingController.deleteRating);

export default router;