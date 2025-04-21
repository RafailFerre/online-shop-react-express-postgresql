import express from 'express';
const router = express.Router(); // get function Router from express


router.post('/register', (req, res) => {
  res.json({ message: 'Create a user' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login a user' });
});

router.get('/auth', (req, res) => {
    res.status(200).json({ message: 'Authenticated' });
  });

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