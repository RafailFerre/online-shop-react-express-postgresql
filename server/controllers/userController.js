/* eslint-disable no-undef */
import ApiError from "../error/ApiError.js";  // const ApiError = require('../error/ApiError');
import { User, Basket } from "../models/models.js";  // const { User, Basket } = require('../models/models');
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import 'dotenv/config';


// Function to generate a JWT token for the user
// Parameters: id (user ID), email (user email), role (USER or ADMIN)
// Returns: A signed JWT token valid for 24 hours
const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role}, 
        process.env.JWT_SECRET_KEY, 
        {expiresIn: '24h'}
    );
}

// Class with methods for working with users
class UserController {
    async register(req, res, next) {
        try {
            // Extract email, password, and role from the request body
            const { email, password, role } = req.body;

            // --- Validation ---
            // Check if email and password are provided
            if (!email || !password) {
                return next(ApiError.badRequest('Email and password are required', { fields: ['email', 'password'] }));
            }

            // Validate email format using a regular expression
            // Ensures email has format: <something>@<domain>.<tld>
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return next(ApiError.badRequest('Invalid email format', { field: 'email' }));
            }

            // // Ensure password is at least 6 characters long for security
            // if (password.length < 6) {
            //     return next(ApiError.badRequest('Password must be at least 6 characters', { field: 'password' }));
            // }

            // // Validate role if provided; only 'USER' or 'ADMIN' are allowed
            // if (role && !['USER', 'ADMIN'].includes(role)) {
            //     return next(ApiError.badRequest('Invalid role. Must be USER or ADMIN', { field: 'role' }));
            // }

            // Check if a user with the same email already exists
            const candidate = await User.findOne({where: {email}});
            if (candidate) {
                return ApiError.badRequest('User with this email already exists');
            }

            // --- Hash Password ---
            // Hash the password using bcrypt
            const hashPassword = await bcrypt.hash(password, 5);

            // --- Create User ---
            // Create a new user in the database
            const user = await User.create({
                email, 
                role: role || 'USER', 
                password: hashPassword
            });

            // --- Create Basket ---
            // Create a basket for the new user (1:1 relationship)
            const basket = await Basket.create({userId: user.id});

            // --- Generate JWT ---
            // Create a JWT token containing user data (id, email, role)
            const token = generateJwt(user.id, user.email, user.role);
            
            // --- Send Response ---
            // Return the JWT token and user data to the client
            return res.status(201).json({
                token, // JWT for authentication in future requests
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                }
            });
        } catch (error) {
            // --- Error Handling ---
            // Log the error for debugging purposes
            console.error('Error registering user:', error);
            // Return a 500 Internal Server Error with error details
            return next(ApiError.internal('Error registering user', { details: error.message }));
        }
    }

    async login(req, res, next) {
        const {email, password} = req.body;
        const user = await User.findOne({where: {email}});
        if (!user) {
            return next(ApiError.internal('User not found'));
        }

        const comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.internal('Invalid password'));
        }

        const token = generateJwt(user.id, user.email, user.role);
        return res.json({token, user: {id: user.id, email: user.email, role: user.role}});
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role);
        return res.json({token, user: {id: req.user.id, email: req.user.email, role: req.user.role}});
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