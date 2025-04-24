import ApiError from "../error/ApiError.js";  // const ApiError = require('../error/ApiError');

// class with methods for working with users
class UserController {
    async register(req, res) {
        res.json({ message: 'Create a user' });
    }

    async login(req, res) {
        res.json({ message: 'Login a user' });
    }

    async check(req, res, next) {
        const {id} = req.query;
        if (!id) {
           return next(ApiError.badRequest(`User not found`));
        }
        res.json(id);
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