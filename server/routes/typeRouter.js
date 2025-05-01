import express from 'express'; // const express = require('express');
const router = express.Router(); // get function Router from express 
import typeController from '../controllers/typeController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';


router.post('/', AuthMiddleware, typeController.create); // Listens for HTTP POST requests to the root URL ('/'). typeController.create: Calls the create function from the typeController module to handle the request.

router.get('/', typeController.getAll);

router.get('/:id', typeController.getOne);

router.put('/:id', AuthMiddleware, typeController.update);

router.delete('/:id', AuthMiddleware, typeController.delete);

export default router;