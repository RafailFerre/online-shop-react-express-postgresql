class ApiError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }

    static badRequest(message) {
        return new ApiError(404, message);
    }

    static internal(message) {
        return new ApiError(500, message);
    }

    static forbidden(message)
    {
        return new ApiError(403, message)
    }

}

export default ApiError;  // module.exports = ApiError;

// The ApiError class extends the built-in Error class and represents an error that occurs in an API. It has a constructor and three static methods that create instances of ApiError with specific status codes.

// Class Methods:

// constructor(status, message): Initializes an ApiError instance with a given status code and error message.
// badRequest(message): Creates an ApiError instance with a 404 status code (indicating a bad request) and a given error message.
// internal(message): Creates an ApiError instance with a 500 status code (indicating an internal server error) and a given error message.
// forbidden(message): Creates an ApiError instance with a 403 status code (indicating that access is forbidden) and a given error message.