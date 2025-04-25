import express from 'express'; // const express = require('express');
const router = express.Router(); // get function Router from express 
import typeController from '../controllers/typeController.js';


router.post('/', typeController.create); // Listens for HTTP POST requests to the root URL ('/'). typeController.create: Calls the create function from the typeController module to handle the request.

router.get('/', typeController.getAll);

router.get('/:id', typeController.getOne);

router.put('/:id', typeController.update);

router.delete('/:id', typeController.delete);

export default router;