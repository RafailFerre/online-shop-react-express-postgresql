import express from 'express'; // const express = require('express');
const router = express.Router(); // get method Router from express
import brandController from '../controllers/brandController.js';



router.post('/', brandController.create); // Listens for HTTP POST requests to the root URL ('/'). brandController.create: Calls the create function from the typeController module to handle the request.

router.get('/', brandController.getAll);

router.get('/:id', brandController.getOne);

router.put('/:id', brandController.update);

router.delete('/:id', brandController.delete);


export default router;