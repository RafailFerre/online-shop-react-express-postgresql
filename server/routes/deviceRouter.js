import express from 'express'; // const express = require('express');
const router = express.Router(); // get method Router from express
import deviceController from '../controllers/deviceController.js';

router.post('/', deviceController.create); // Listens for HTTP POST requests to the root URL ('/'). deviceController.create: Calls the create function from the typeController module to handle the request.

router.get('/', deviceController.getAll);

router.get('/:id', deviceController.getOne);

router.put('/:id', deviceController.update);

router.delete('/:id', deviceController.delete);

export default router;

