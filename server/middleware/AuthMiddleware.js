/* eslint-disable no-undef */
import jwt from 'jsonwebtoken';
import ApiError from '../error/ApiError.js';

export default function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return next(ApiError.unauthorized('No token provided'));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return next(ApiError.unauthorized('User is not authorized', { details: err.message }));
    }
}