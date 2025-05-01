import express from 'express'; // const express = require('express');
const router = express.Router(); // get method Router from express
import deviceController from '../controllers/deviceController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';

router.post('/', AuthMiddleware, deviceController.create); // Listens for HTTP POST requests to the root URL ('/'). deviceController.create: Calls the create function from the typeController module to handle the request.

router.get('/', deviceController.getAll);

router.get('/:id', deviceController.getOne);

router.put('/:id', AuthMiddleware, deviceController.update);

router.delete('/:id', AuthMiddleware, deviceController.delete);

export default router;

