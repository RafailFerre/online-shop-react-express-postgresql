class UserController {
    async register(req, res) {
        res.json({ message: 'Create a user' });
    }
    async login(req, res) {
        res.json({ message: 'Login a user' });
    }
    async check(req, res) {
        res.json({ message: 'Authenticated' });
    }
}

export default new UserController();