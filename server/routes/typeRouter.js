import express from 'express';
const router = express.Router();


router.post('/', (req, res) => {
    res.json({ message: 'Create a type' });
})
router.get('/', (req, res) => {
    res.json({ message: 'Get all types' });
});

router.get('/:id', (req, res) => {
    res.json({ message: `Get type with ID ${req.params.id}` });
});

router.put('/', (req, res) => {
    res.json({ message: 'Update a type' });
})

router.delete('/', (req, res) => {
    res.json({ message: 'Delete a type' });
});

export default router;