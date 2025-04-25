import express from 'express'; // const express = require('express');
const router = express.Router(); // get method Router from express
import userController from '../controllers/userController.js';


router.post('/register', userController.register); // code sets up an HTTP POST route for the /register endpoint, which calls the register method on the userController instance when a request is made to that endpoint. In other words, when a POST request is sent to the /register URL, the register method in userController will be executed to handle the request.

router.post('/login', userController.login);

router.get('/auth', userController.check); //code sets up an HTTP GET route for the /auth endpoint, which calls the check method on the userController instance when a request is made to that endpoint.

router.get('/:id', (req, res) => {
  res.json({ message: `Get user with ID ${req.params.id}` });
});

router.put('/', (req, res) => {
  res.json({ message: 'Update a user' });
})

router.delete('/', (req, res) => {
  res.json({ message: 'Delete a user' });
});

export default router;

// import { Router } from "express";
// const router = express.Router();

// router.post('/register', (req, res) => {});

// router.post('/login', (req, res) => {});

// router.get('/auth', (req, res) => {
//     res.status(200).json({ message: 'Server is running...' });
// });

// export default router;