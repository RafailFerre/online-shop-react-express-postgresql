import express from 'express'; // const express = require('express');
const router = express.Router(); // get method Router from express
import brandController from '../controllers/brandController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import RoleCheckMiddleware from '../middleware/RoleCheckMiddleware.js';



router.post('/', AuthMiddleware, RoleCheckMiddleware(['ADMIN']), brandController.create); // Listens for HTTP POST requests to the root URL ('/'). brandController.create: Calls the create function from the typeController module to handle the request.

router.get('/', brandController.getAll); // Sets up an HTTP GET route for the root URL ('/') that calls the getAll function from the brandController module to handle the request.

router.get('/:id', brandController.getOne);

router.put('/:id', AuthMiddleware, brandController.update);

router.delete('/:id', AuthMiddleware, brandController.delete);


export default router;

// AuthMiddleware: Requires the request to be authenticated before proceeding.
// RoleCheckMiddleware(['ADMIN']): Requires the authenticated user to have the 'ADMIN' role before proceeding.