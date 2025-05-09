import express from 'express'; // const express = require('express');
const router = express.Router(); // get function Router from express 
import typeController from '../controllers/typeController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import RoleCheckMiddleware from '../middleware/RoleCheckMiddleware.js';


router.post('/', AuthMiddleware, RoleCheckMiddleware(['ADMIN']), typeController.create); // Listens for HTTP POST requests to the root URL ('/'). typeController.create: Calls the create function from the typeController module to handle the request.

router.get('/', typeController.getAll);

router.get('/:id', typeController.getOne);

router.put('/:id', AuthMiddleware, RoleCheckMiddleware(['ADMIN']), typeController.update);

router.delete('/:id', AuthMiddleware, RoleCheckMiddleware(['ADMIN']), typeController.delete);

export default router;

// AuthMiddleware: Requires the request to be authenticated before proceeding.
// RoleCheckMiddleware(['ADMIN']): Requires the authenticated user to have the 'ADMIN' role before proceeding.