class UserController {
    async register(req, res) {
        res.json({ message: 'Create a user' });
    }

    async login(req, res) {
        res.json({ message: 'Login a user' });
    }

    async check(req, res) {
        const query = req.query;
        res.json(query);
        // res.json({ message: 'Authenticated' });
    }

    // async get(req, res) {
    //     res.json({ message: `Get user with ID ${req.params.id}` });
    // }

    // async update(req, res) {
    //     res.json({ message: 'Update a user' });
    // }

    // async delete(req, res) {
    //     res.json({ message: 'Delete a user' });
    // }
}

export default new UserController();