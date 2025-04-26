import ApiError from '../error/ApiError.js'; // const ApiError = require('../error/ApiError');
import { Brand } from '../models/models.js'; // const {Brand} = require('../models/models');

// BrandController manages HTTP requests for brand-related operations
class BrandController {
    // Create a new brand
    async create(req, res, next) {
        try {
            // Extract name from request body
            const { name } = req.body;

            // Validate: Ensure name is a non-empty string
            if (!name || typeof name !== 'string' || name.trim() === '') {
                return next(ApiError.badRequest('Brand name is required and must be a non-empty string'));
            }

            // Validate: Ensure name length does not exceed 50 characters
            if (name.length > 50) {
                return next(ApiError.badRequest('Brand name must not exceed 50 characters'));
            }

            // Check if a brand with the same name already exists
            const existingBrand = await Brand.findOne({ where: { name } });
            if (existingBrand) {
                return next(ApiError.badRequest('Brand with this name already exists'));
            }

            // Create new brand in the database
            const brand = await Brand.create({ name: name.trim() });

            // Return the created brand as JSON
            return res.json(brand);
        } catch (error) {
            // Handle unexpected errors
            return next(ApiError.internal('Error creating brand'));
        }
    }

    // Retrieve a single brand by ID
    async getOne(req, res, next) {
        try {
            // Extract ID from request parameters
            const { id } = req.params;

            // Validate: Ensure ID is a positive integer
            if (!id || isNaN(id) || parseInt(id) <= 0) {
                return next(ApiError.badRequest('Invalid brand ID'));
            }

            // Find brand by ID in the database
            const brand = await Brand.findOne({ where: { id } });

            // Check if brand exists
            if (!brand) {
                return next(ApiError.badRequest('Brand not found'));
            }

            // Return the brand as JSON
            return res.json(brand);
        } catch (error) {
            // Handle unexpected errors
            return next(ApiError.internal('Error fetching brand'));
        }
    }

    // Retrieve all brands
    async getAll(req, res, next) {
        try {
            // Fetch all brands from the database
            const brands = await Brand.findAll();

            // Return the list of brands as JSON
            return res.json(brands);
        } catch (error) {
            // Handle unexpected errors
            return next(ApiError.internal('Error fetching brands'));
        }
    }

    // Update an existing brand
    async update(req, res, next) {
        try {
            // Extract name from request body and ID from parameters
            const { name } = req.body;
            const { id } = req.params;

            // Validate: Ensure ID is a positive integer
            if (!id || isNaN(id) || parseInt(id) <= 0) {
                return next(ApiError.badRequest('Invalid brand ID'));
            }

            // Validate: Ensure name is a non-empty string
            if (!name || typeof name !== 'string' || name.trim() === '') {
                return next(ApiError.badRequest('Brand name is required and must be a non-empty string'));
            }

            // Validate: Ensure name length does not exceed 50 characters
            if (name.length > 50) {
                return next(ApiError.badRequest('Brand name must not exceed 50 characters'));
            }

            // Check if brand exists
            const brand = await Brand.findOne({ where: { id } });
            if (!brand) {
                return next(ApiError.badRequest('Brand not found'));
            }

            // Check if the new name is already taken by another brand
            const existingBrand = await Brand.findOne({ where: { name } });
            if (existingBrand && existingBrand.id !== parseInt(id)) {
                return next(ApiError.badRequest('Brand with this name already exists'));
            }

            // Update brand name in the database
            await Brand.update({ name: name.trim() }, { where: { id } });

            // Fetch the updated brand
            const updatedBrand = await Brand.findOne({ where: { id } });

            // Return the updated brand as JSON
            return res.json(updatedBrand);
        } catch (error) {
            // Handle unexpected errors
            return next(ApiError.internal('Error updating brand'));
        }
    }

    // Delete a brand by ID
    async delete(req, res, next) {
        try {
            // Extract ID from request parameters
            const { id } = req.params;

            // Validate: Ensure ID is a positive integer
            if (!id || isNaN(id) || parseInt(id) <= 0) {
                return next(ApiError.badRequest('Invalid brand ID'));
            }

            // Check if brand exists in the database
            const brand = await Brand.findOne({ where: { id } });
            if (!brand) {
                return next(ApiError.badRequest('Brand not found'));
            }

            // Delete brand from the database
            await Brand.destroy({ where: { id } });

            // Return success message as JSON
            return res.json({ message: 'Brand deleted successfully' });
        } catch (error) {
            // Handle unexpected errors
            return next(ApiError.internal('Error deleting brand'));
        }
    }
}

// Export a new instance of BrandController
export default new BrandController();  // module.exports = new BrandController();