import express from 'express';
const router = express.Router();

router.post('/', (req, res) => {
    res.json({ message: 'Create a brand' });
})
router.get('/', (req, res) => {
    res.json({ message: 'Get all brands' });
});

router.get('/:id', (req, res) => {
    res.json({ message: `Get brand with ID ${req.params.id}` });
});

router.put('/', (req, res) => {
    res.json({ message: 'Update a brand' });
})

router.delete('/', (req, res) => {
    res.json({ message: 'Delete a brand' });
});

export default router;