import ApiError from "../error/ApiError.js";

export default function ErrorHandlingMiddleware(err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message });
    } else {
        return res.status(500).json({ message: err.message });
    }
}

// This is an Express.js middleware function that handles errors. 
// It checks if the error is an instance of `ApiError` and returns a response with the error's status code and message. 
// If the error is not an `ApiError`, it returns a generic 500 Internal Server Error response with the error message.