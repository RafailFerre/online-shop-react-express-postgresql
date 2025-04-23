import express from 'express';
const router = express.Router(); // get function Router from express
import userController from '../controllers/userController.js';


router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/auth', userController.check);

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
// const routers = express.Router();

// router.post('/register', (req, res) => {});

// router.post('/login', (req, res) => {});

// router.get('/auth', (req, res) => {
//     res.status(200).json({ message: 'Server is running...' });
// });

// export default router;