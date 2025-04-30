/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import ApiError from '../error/ApiError.js';

// ErrorHandlingMiddleware handles errors in Express.js applications
export default function ErrorHandlingMiddleware(err, req, res, next) {
    // Log error details for debugging purposes
    console.error(`[${new Date().toISOString()}] Error:`, {
        method: req.method,
        url: req.originalUrl,
        error: err.message,
        stack: err.stack,
    });

    // Check if error is an instance of ApiError
    if (err instanceof ApiError) {
        // Return custom error with status and message
        return res.status(err.status).json({
            error: {
                message: err.message,
                status: err.status,
            },
        });
    }

    // Handle unexpected errors with generic response
    return res.status(500).json({
        error: {
            message: 'Internal Server Error',
            status: 500,
            // Include error details only in development mode
            details: process.env.NODE_ENV === 'development' ? err.message : undefined,
        },
    });
}

// This is an Express.js middleware function that handles errors. 
// It checks if the error is an instance of `ApiError` and returns a response with the error's status code and message. 
// If the error is not an `ApiError`, it returns a generic 500 Internal Server Error response with the error message.