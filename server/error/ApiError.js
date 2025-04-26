import httpStatus from 'http-status';  // const httpStatus = require('http-status');

// ApiError class extends Error to handle API-specific errors
class ApiError extends Error {
    // Constructor initializes error with status, message, and optional details
    constructor(status, message, details = null) {
        super(message); // Pass message to parent Error class
        this.status = status; // HTTP status code (e.g., 400, 500)
        this.message = message; // Error message
        this.details = details; // Optional details (e.g., validation errors)
        Error.captureStackTrace(this, this.constructor); // Capture stack trace
    }

    // Create a Bad Request error (400)
    static badRequest(message, details = null) {
        return new ApiError(httpStatus.BAD_REQUEST, message, details);
    }

    // Create an Internal Server Error (500)
    static internal(message, details = null) {
        return new ApiError(httpStatus.INTERNAL_SERVER_ERROR, message, details);
    }

    // Create a Forbidden error (403)
    static forbidden(message, details = null) {
        return new ApiError(httpStatus.FORBIDDEN, message, details);
    }

    // Create an Unauthorized error (401)
    static unauthorized(message, details = null) {
        return new ApiError(httpStatus.UNAUTHORIZED, message, details);
    }

    // Create a Not Found error (404)
    static notFound(message, details = null) {
        return new ApiError(httpStatus.NOT_FOUND, message, details);
    }

    // Create an Unprocessable Entity error (422)
    static unprocessableEntity(message, details = null) {
        return new ApiError(httpStatus.UNPROCESSABLE_ENTITY, message, details);
    }
}

export default ApiError;  // module.exports = ApiError;

// The ApiError class extends the built-in Error class and represents an error that occurs in an API. It has a constructor and three static methods that create instances of ApiError with specific status codes.

// Class Methods:

// constructor(status, message): Initializes an ApiError instance with a given status code and error message.
// badRequest(message): Creates an ApiError instance with a 404 status code (indicating a bad request) and a given error message.
// internal(message): Creates an ApiError instance with a 500 status code (indicating an internal server error) and a given error message.
// forbidden(message): Creates an ApiError instance with a 403 status code (indicating that access is forbidden) and a given error message.