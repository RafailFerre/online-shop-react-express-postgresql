import ApiError from '../error/ApiError.js';

// Factory function to create middleware for role-based authorization
// Parameters: roles - array of allowed roles (e.g., ['ADMIN'])
// Returns: Middleware function to check if user has required role
export default function (roles) {
    return function (req, res, next) {
        try {
            // Extract user role from req.user (set by AuthMiddleware)
            const userRole = req.user?.role;
            
            // Check if user is authenticated and has one of the allowed roles
            // If not, return 403 Forbidden error with required roles in message
            if (!userRole || !roles.includes(userRole)) {
                return next(ApiError.forbidden(`Access denied. Required roles: ${roles.join(', ')}`));
            }
            
            // User has required role; proceed to the next middleware or route handler
            next();
        } catch (error) {
            // Handle unexpected errors (e.g., req.user missing)
            // Return 403 Forbidden error with error details
            return next(ApiError.forbidden('Access denied', { details: error.message }));
        }
    };
}







// /* eslint-disable no-undef */
// import jwt from 'jsonwebtoken';
// import ApiError from '../error/ApiError.js';

// export default function (role) {

//     return function (req, res, next) {
//         // Allow OPTIONS requests (used for CORS preflight) to pass without token verification
//         if (req.method === 'OPTIONS') {
//             return next();
//         }

//         try {
//             // Extract the token from the Authorization header (format: Bearer <token>)
//             const token = req.headers.authorization?.split(' ')[1];
            
//             // Check if token is provided; if not, return 401 Unauthorized error
//             if (!token) {
//                 return next(ApiError.unauthorized('No token provided'));
//             }

//             // Verify the token using the secret key from environment variables
//             const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            
//             // Check if user role is 'ADMIN'
//             if (decoded.role !== role) {
//                 return next(ApiError.forbidden('Access is denied'));
//             }
            
//             // Attach decoded user data (id, email, role) to req.user for use in subsequent middleware/controllers
//             req.user = decoded;
            
//             // Proceed to the next middleware or route handler
//             next();
//         } catch (error) {
//             // Handle token verification errors (e.g., invalid token, expired token)
//             // Return 401 Unauthorized error with error details
//             return next(ApiError.unauthorized('User is not authorized', { details: error.message }));
//         }
//     }
// }