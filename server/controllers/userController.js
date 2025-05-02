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
            // eslint-disable-next-line no-unused-vars
            const basket = await Basket.create({userId: user.id});

            // --- Generate JWT ---
            // Create a JWT token containing user data (id, email, role)
            const token = generateJwt(user.id, user.email, user.role);
            
            // --- Send Response ---
            // Return the JWT token and user data to the client
            return res.status(201).json({
                token, // JWT for authentication in future requests
                user: { id: user.id, email: user.email, role: user.role }
            });
        } catch (error) {
            // --- Error Handling ---
            // Log the error for debugging purposes
            console.error('Error registering user:', error);
            // Return a 500 Internal Server Error with error details
            return next(ApiError.internal('Error registering user', { details: error.message }));
        }
    }

    // Authenticates a user with email and password
    async login(req, res, next) {
        try {
            // Extract email and password from the request body
            const { email, password } = req.body;

            // Validate required fields
            if (!email || !password) {
                return next(ApiError.badRequest('Email and password are required', { fields: ['email', 'password'] }));
            }

            // Find user by email
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return next(ApiError.unauthorized('Invalid email or password', { field: 'email' }));
            }

            // Compare provided password with stored hash
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return next(ApiError.unauthorized('Invalid email or password', { field: 'password' }));
            }

            // Generate JWT token
            const token = generateJwt(user.id, user.email, user.role);

            // Return token and user data
            return res.json({
                token,
                user: { id: user.id, email: user.email, role: user.role }
            });
        } catch (error) {
            console.error('Error logging in user:', error);
            return next(ApiError.internal('Error logging in user', { details: error.message }));
        }
    }

    // Checks if the user is authenticated and returns their data
    async check(req, res, next) {
        try {
            // User data is already verified and attached by AuthMiddleware
            const { id, email, role } = req.user;

            // Generate a new token (optional, for token refresh)
            const token = generateJwt(id, email, role);

            // Return user data and new token
            return res.json({
                token,
                user: { id, email, role }
            });
        } catch (error) {
            console.error('Error checking user:', error);
            return next(ApiError.internal('Error checking user', { details: error.message }));
        }
    }



    async getAll(req, res) {
        res.json({ message: 'Get all users' });
    }

    async getOne(req, res) {
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