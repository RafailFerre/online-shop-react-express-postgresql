import express from 'express'; // const express = require('express');
const router = express.Router(); // get method Router from express
import deviceController from '../controllers/deviceController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js'; // const AuthMiddleware = require('../middleware/AuthMiddleware');
import RoleCheckMiddleware from '../middleware/RoleCheckMiddleware.js'; // const RoleCheckMiddleware = require('../middleware/RoleCheckMiddleware');

router.post('/', AuthMiddleware, RoleCheckMiddleware(['ADMIN']), deviceController.create); // Listens for HTTP POST requests to the root URL ('/'). deviceController.create: Calls the create function from the typeController module to handle the request.

router.get('/', deviceController.getAll);

router.get('/:id', deviceController.getOne);

router.put('/:id', AuthMiddleware, RoleCheckMiddleware(['ADMIN']), deviceController.update);

router.delete('/:id', AuthMiddleware, RoleCheckMiddleware(['ADMIN']), deviceController.delete);

export default router;

// AuthMiddleware: Requires the request to be authenticated before proceeding.
// RoleCheckMiddleware(['ADMIN']): Requires the authenticated user to have the 'ADMIN' role before proceeding.

