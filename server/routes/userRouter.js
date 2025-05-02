import express from 'express'; // const express = require('express');
const router = express.Router(); // get method Router from express
import userController from '../controllers/userController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import RoleCheckMiddleware from '../middleware/RoleCheckMiddleware.js';


router.post('/register', userController.register); // code sets up an HTTP POST route for the /register endpoint, which calls the register method on the userController instance when a request is made to that endpoint. In other words, when a POST request is sent to the /register URL, the register method in userController will be executed to handle the request.

router.post('/login', userController.login);

router.get('/auth', AuthMiddleware, userController.check); //code sets up an HTTP GET route for the /auth endpoint, which calls the check method on the userController instance when a request is made to that endpoint.

router.get('/:id', AuthMiddleware, userController.getOne);

router.put('/:id', AuthMiddleware, userController.update)

router.delete('/:id', AuthMiddleware, userController.delete);


router.get('/', AuthMiddleware, RoleCheckMiddleware(['ADMIN']), userController.getAll);

export default router;

// AuthMiddleware: Requires the request to be authenticated before proceeding.
// RoleCheckMiddleware(['ADMIN']): Requires the authenticated user to have the 'ADMIN' role before proceeding.