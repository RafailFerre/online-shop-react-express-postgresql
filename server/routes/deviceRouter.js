import express from 'express';
const router = express.Router();

router.post('/', (req, res) => {
  res.json({ message: 'Create a device' });
});

router.get('/', (req, res) => {
  res.json({ message: 'Get all devices' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get device with ID ${req.params.id}` });
});

router.put('/', (req, res) => {
  res.json({ message: 'Update a device' });
})

router.delete('/', (req, res) => {
  res.json({ message: 'Delete a device' });
})

export default router;

