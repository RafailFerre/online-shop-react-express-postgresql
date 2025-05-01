/* eslint-disable no-undef */
import ApiError from "../error/ApiError.js";  // const ApiError = require('../error/ApiError');
import { User, Basket } from "../models/models.js";  // const { User, Basket } = require('../models/models');
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import 'dotenv/config';

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role}, 
        process.env.JWT_SECRET_KEY, 
        {expiresIn: '24h'}
    );
}

// Class with methods for working with users
class UserController {
    async register(req, res) {
        const { email, password, role } = req.body;
        if(!email || !password) {
            return ApiError.badRequest('Incorrect email or password');
        }
        const candidate = await User.findOne({where: {email}});
        if (candidate) {
            return ApiError.badRequest('User with this email already exists');
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({
            email, 
            role: role || 'USER', 
            password: hashPassword
        });

        const basket = await Basket.create({userId: user.id});

        const token = generateJwt(user.id, user.email, user.role);
        
        return res.json({
            token,
            user: {
                id: user.id,
                email,
                role
            }
        });
    }

    async login(req, res) {
        
    }

    async check(req, res, next) {
        const {id} = req.query;
        if (!id) {
           return next(ApiError.badRequest(`User not found`));
        }
        res.json(id);
    }






    async get(req, res) {
        res.json({ message: `Get user with ID ${req.params.id}` });
    }

    async update(req, res) {
        res.json({ message: 'Update a user' });
    }

    async delete(req, res) {
        res.json({ message: 'Delete a user' });
    }
}

export default new UserController();