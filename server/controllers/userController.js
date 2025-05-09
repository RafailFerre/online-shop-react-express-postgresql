/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import ApiError from "../error/ApiError.js";  // const ApiError = require('../error/ApiError');
import { User, Basket, BasketDevice, Rating } from "../models/models.js";  // const { User, Basket } = require('../models/models');
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';


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
            let { email, password, role } = req.body;
            email = email.toLowerCase().trim(); // Convert email to lowercase and remove leading/trailing spaces
            password = password.trim(); // Remove leading/trailing spaces

            // --- Validation ---
            // Check if email and password are provided
            if (!email || !password) {
                return next(ApiError.badRequest('Email and password are required', { fields: ['email', 'password'] }));
            }

            // Validate email format using a regular expression. Ensures email has format: <something>@<domain>.<tld>
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

            // Check if admin is registering an admin
            if (role === 'ADMIN' && (!req.user || req.user.role !== 'ADMIN')) {
                return next(ApiError.forbidden('Only admins can register new admins'));
            }

            // Check if email is already registered
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return next(ApiError.badRequest('Email already registered', { field: 'email' }));
            }

            // --- Hash Password ---
            // Hash the password using bcrypt
            const hashPassword = await bcrypt.hash(password, 5);

            // --- Create User ---
            // Create a new user in the database
            const user = await User.create({
                email: email, 
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
            let { email, password } = req.body;
            email = email.toLowerCase().trim();
            password = password.trim();

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


    async getAll(req, res, next) {
        try {
            // Fetch all users from the database, excluding password
            const users = await User.findAll({ attributes: ['id', 'email', 'role'] });
            
            // Return the list of users as JSON
            return res.json(users);
        } catch (error) {
            // Handle unexpected errors
            console.error('Error retrieving users:', error);
            return next(ApiError.internal('Error fetching users', { details: error.message }));
        }
        
    }

    // Retrieves data for a single user by ID
    // Expects: req.params.id (user ID), valid JWT token (via AuthMiddleware)
    async getOne(req, res, next) {
       try {
            // Extract ID from request parameters
            const { id } = req.params;

            // Validate: Ensure ID is a positive integer
            if (!id || isNaN(id) || parseInt(id) <= 0) {
                return next(ApiError.badRequest('Invalid user ID', { field: 'id' }));
            }

            // Find user by Primary Key, excluding password
            const user = await User.findByPk(id, { attributes: ['id', 'email', 'role'] });

            // Check if user exists
            if (!user) {
                return next(ApiError.notFound('User not found', { field: 'id' }));
            }

            // Check access: users can view their own data, admins can view any user
            if (user.id !== req.user.id && req.user.role !== 'ADMIN') {
                return next(ApiError.forbidden('Access denied. You can only view your own data'));
            }

            // Return user data
            return res.json(user);
       } catch (error) {
        console.error('Error getting user:', error);
        return next(ApiError.internal('Error getting user', { details: error.message }));
       }
    }

    // Updates user data (email, password, role)
    // Expects: req.params.id (user ID), req.body (email, password, role), valid JWT token
    // Returns: JSON with updated user data (id, email, role)
    // Throws: ApiError on validation failure, access denial, or database errors
    async update(req, res, next) {
        try {
            // Extract id, email, password, and role from the parameters and request body
            const { id } = req.params;
            let { email, password, role } = req.body;
            email = email.toLowerCase().trim();
            password = password.trim();

            // Validate: Ensure id is a positive integer
            if (!id || isNaN(id) || parseInt(id) <= 0) {
                return next(ApiError.badRequest('Invalid user ID', { field: 'id' }));
            }

            // Find user by Primary Key, excluding password
            const user = await User.findByPk(id);
            // Check if user exists
            if (!user) {
                return next(ApiError.notFound('User not found', { field: 'id' }));
            }

            // Check access: user can update their own data, admins can update any user
            if (user.id !== req.user.id && req.user.role !== 'ADMIN') {
                return next(ApiError.forbidden('Access denied. You can only update your own data'));
            }

            // Prepare update data
            const updateData = {};

            // Validate and add email if provided
            if (email) {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    return next(ApiError.badRequest('Invalid email format', { field: 'email' }));
                }
                // Check if new email is already registered by another user
                const existingUser = await User.findOne({ where: { email } });
                if (existingUser && existingUser.id !== user.id) {
                    return next(ApiError.badRequest('Email already registered', { field: 'email' }));
                }
                updateData.email = email;
            }

            // Validate and password if provided
            if (password) {
                // if (password.length < 6) {
                //     return next(ApiError.badRequest('Password must be at least 6 characters', { field: 'password' }));
                // }
                updateData.password = await bcrypt.hash(password, 5);
            }

            // Validate and role if provided
            if (role) {
                if (!['USER', 'ADMIN'].includes(role)) {
                    return next(ApiError.badRequest('Invalid role', { field: 'role' }));
                }
                if (req.user.role !== 'ADMIN') {
                    return next(ApiError.forbidden('Access denied. Only admins can update role'));
                }
                updateData.role = role;
            }

            // Check if there are any fields to update
            if (Object.keys(updateData).length === 0) {
                return next(ApiError.badRequest('No valid fields provided for update'));
            }

            // Update user data
            await user.update(updateData);

            // Return updated user data
            return res.json({
                id: user.id,
                email: user.email,
                role: user.role
            });

        } catch (error) {
            console.error('Error updating user:', error);
            return next(ApiError.internal('Error updating user', { details: error.message }));
        }
    }

    // Deletes a user and their associated data
    // Expects: req.params.id (user ID), valid JWT token
    // Returns: JSON with success message
    // Throws: ApiError if user not found, access denied, or database errors
    async delete(req, res, next) {
        try {
            const { id } = req.params;

            // Validate ID: ensure it's provided, numeric, and positive
            if (!id || isNaN(id) || parseInt(id) <= 0) {
                return next(ApiError.badRequest('Invalid user ID', { field: 'id' }));
            }

            // Find user by primary key
            const user = await User.findByPk(id);
            if (!user) {
                return next(ApiError.notFound('User not found', { field: 'id' }));
            }

            // Check access: user can delete their own account, admins can delete any user
            if (req.user.id !== user.id && req.user.role !== 'ADMIN') {
                return next(ApiError.forbidden('Access denied. You can only delete your own account or need ADMIN role'));
            }

            // Delete associated data: basket, ratings, basket devices
            await Promise.all([
                Basket.destroy({ where: { userId: id } }),
                Rating.destroy({ where: { userId: id } }),
                BasketDevice.destroy({ where: { basketId: id } }), // Assumes BasketDevice is linked via basket
            ]);

            // Delete user
            await User.destroy({ where: { id } });

            // Return success message
            return res.json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            return next(ApiError.internal('Error deleting user', { details: error.message }));
        }
    }


    // Initializes the first admin user
    // Expects: req.body = { email, password, secret }
    // Returns: JSON with JWT token and user data (id, email, role)
    // Throws: ApiError if admins exist, secret is invalid, or validation fails
    async initAdmin(req, res, next) {
        try {
            // Extract and normalize email, password, secret from request body
            let { email, password, secret } = req.body;
            email = email ? email.trim().toLowerCase() : '';
            password = password ? password.trim() : '';
            secret = secret ? secret.trim() : '';

            // Validate required fields
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return next(ApiError.badRequest('Invalid email format', { field: 'email' }));
            }
            if (!password || password.length < 6) {
                return next(ApiError.badRequest('Password must be at least 6 characters', { field: 'password' }));
            }
            if (!secret) {
                return next(ApiError.badRequest('Secret key is required', { field: 'secret' }));
            }

            // Verify the secret key from .env
            if (secret !== process.env.INIT_ADMIN_SECRET) {
                return next(ApiError.forbidden('Invalid secret key'));
            }

            // Check if any admins already exist
            const adminCount = await User.count({ where: { role: 'ADMIN' } });
            if (adminCount > 0) {
                return next(ApiError.forbidden('Admin already exists. Use /register with admin credentials'));
            }

            // Check if email is already registered
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return next(ApiError.badRequest('Email already registered', { field: 'email' }));
            }

            // Hash the password with bcrypt (10 salt rounds)
            const hashPassword = await bcrypt.hash(password, 10);

            // Create new admin user
            const user = await User.create({
                email,
                password: hashPassword,
                role: 'ADMIN',
            });

            // Create a basket for the user
            await Basket.create({ userId: user.id });

            // Generate JWT token
            const token = generateJwt(user.id, user.email, user.role);

            // Return token and user data
            return res.json({
                token,
                user: { id: user.id, email: user.email, role: user.role },
            });
        } catch (error) {
            console.error('Error initializing admin:', error);
            return next(ApiError.internal('Error initializing admin', { details: error.message }));
        }
    }

}

export default new UserController();