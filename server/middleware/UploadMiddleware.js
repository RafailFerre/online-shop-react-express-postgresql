import multer from 'multer'; // const multer = require('multer');
import { v4 as uuidv4 } from 'uuid'; // const { v4: uuidv4 } = require('uuid');
import ApiError from '../error/ApiError.js';
import path from 'path';
import { fileURLToPath } from 'url'; // const { fileURLToPath } = require('url');

// Resolve __dirname for ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure storage for uploaded files
const storage = multer.diskStorage({
    // Specify destination folder for uploaded files
    destination: (req, file, cb) => {
        // Set destination folder for uploaded files
        const destinationPath = path.join(__dirname, '../static/images/');
        cb(null, destinationPath); // Save files to static/images folder
    },
    // Generate filename for uploaded files
    filename: (req, file, cb) => {
        // Generate a unique filename using UUID for each file
        const uniqueName = `device_${uuidv4()}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName); // Save files with unique names
    },
});

// Configure multer for image uploads
const upload = multer({
    // Use defined storage configuration
    storage,
    // Filter files to allow only images
    fileFilter: (req, file, cb) => {
        // Check if file is an image (jpg, jpeg, png or webp)
        if (!file.mimetype.match(/image\/(jpg|jpeg|png|webp)/)) {
            // Reject file and return error if not an image
            return cb(ApiError.badRequest('Only JPG, JPEG, PNG or WEBP images are allowed', { field: 'img', issue: 'invalid_format' }), false);
        }
        // Accept file if it passes the filter
        cb(null, true);
    },
    // Set file size limit
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB (5 * 1024 * 1024 bytes)
}).single('img'); // Handle a single file with field name 'img'

// Export upload middleware for use in controllers
export default upload;


// export default (req, res, next) => {
//     upload(req, res, (err) => {
//         if (err instanceof multer.MulterError) {
//             return next(ApiError.badRequest('File upload error', { issue: err.message }));
//         }
//         if (err) {
//             return next(err);
//         }
//         next();
//     });
// };