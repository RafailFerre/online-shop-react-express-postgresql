import express from 'express'; // const express = require('express');

// Import sub-routers for different API endpoints
import userRouter from './userRouter.js'; // Handles user-related API requests  // const userRouter = require('./userRouter');
import deviceRouter from './deviceRouter.js'; // Handles device-related API requests
import brandRouter from './brandRouter.js'; // Handles brand-related API requests
import typeRouter from './typeRouter.js'; // Handles type-related API requests
import basketRouter from './basketRouter.js'; // Handles basket-related API requests


// Create a new instance of the Express Router
const router = express.Router();

// Connect sub-routers to the main router
// Each sub-router is mounted at a specific path
router.use('/user', userRouter); // Mount user router at /user
router.use('/device', deviceRouter); // Mount device router at /device
router.use('/brand', brandRouter); // Mount brand router at /brand
router.use('/type', typeRouter); // Mount type router at /type
router.use('/basket', basketRouter); // Mount basket router at /basket


// Export the main router as the default export into main index.js as routes when imported 
// This allows other files to import and use this router
export default router;  // module.exports = router