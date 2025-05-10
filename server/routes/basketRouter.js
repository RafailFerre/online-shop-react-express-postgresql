import express from 'express'; // const express = require('express');
const router = express.Router(); // get method Router from express
import basketController from '../controllers/basketController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';


// Protected routes for basket management
router.post('/', AuthMiddleware, basketController.addDevice); // Add device to basket

router.get('/', AuthMiddleware, basketController.getBasket); // Get basket contents

router.delete('/:deviceId', AuthMiddleware, basketController.removeDevice); // Remove device from basket

router.post('/checkout', AuthMiddleware, basketController.checkout); // Process checkout

export default router;