import express from 'express';

// Import routers
import userRouter from './userRouter.js';
import deviceRouter from './deviceRouter.js';
import brandRouter from './brandRouter.js';
import typeRouter from './typeRouter.js';

const router = express.Router(); // get function Router from express

// Connect routers to main router
router.use('/user', userRouter);
router.use('/device', deviceRouter);
router.use('/brand', brandRouter);
router.use('/type', typeRouter);

export default router;