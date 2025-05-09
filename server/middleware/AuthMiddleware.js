/* eslint-disable no-undef */
import jwt from 'jsonwebtoken';
import ApiError from '../error/ApiError.js';

// Middleware to authenticate requests by verifying JWT token
export default function (req, res, next) {
    // Allow OPTIONS requests (used for CORS preflight) to pass without token verification
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        // Extract the token from the Authorization header (format: Bearer <token>)
        const token = req.headers.authorization?.split(' ')[1];
        
        // // Check if token is provided; if not, return 401 Unauthorized error
        // if (!token) {
        //     return next(ApiError.unauthorized('No token provided'));
        // }


        // If no token is provided, proceed without setting req.user (for public routes like register)
        if (!token) {
            req.user = null; // Explicitly set req.user to null for clarity
            return next();
        }


        // Verify the token using the secret key from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        // Attach decoded user data (id, email, role) to req.user for use in subsequent middleware/controllers
        req.user = decoded;
        
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle token verification errors (e.g., invalid token, expired token)
        // Return 401 Unauthorized error with error details
        return next(ApiError.unauthorized('User is not authorized', { details: error.message }));
    }
}