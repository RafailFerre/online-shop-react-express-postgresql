import ApiError from '../error/ApiError.js';  // const ApiError = require('../error/ApiError');
import { Type } from '../models/models.js';  // const { Type } = require('../models/models');

// TypeController manages HTTP requests for type-related operations
class TypeController {
    // Create a new type
    async create(req, res, next) {
        try {
            // Extract name from request body
            const { name } = req.body;

            // Validate: Ensure name is a non-empty string
            if (!name || typeof name !== 'string' || name.trim() === '') {
                return next(ApiError.badRequest('Type name is required and must be a non-empty string', { field: 'name', issue: 'required' }));
            }

            // Validate: Ensure name length does not exceed 50 characters
            if (name.length > 50) {
                return next(ApiError.badRequest('Type name must not exceed 50 characters', { field: 'name', issue: 'too_long' }));
            }

            // Check if a type with the same name already exists
            const existingType = await Type.findOne({ where: { name } });
            if (existingType) {
                return next(ApiError.badRequest('Type with this name already exists', { field: 'name', issue: 'duplicate' }));
            }

            // Create new type in the database
            const type = await Type.create({ name: name.trim() });

            // Return the status code 201 and created type as JSON
            return res.status(201).json(type);
        } catch (error) {
            // Handle unexpected errors
            return next(ApiError.internal('Error creating type', { details: error.message }));
        }
    }

    // Retrieve a single type by ID
    async getOne(req, res, next) {
        try {
            // Extract ID from request parameters
            const { id } = req.params;

            // Validate: Ensure ID is a positive integer
            if (!id || isNaN(id) || parseInt(id) <= 0) {
                return next(ApiError.badRequest('Invalid type ID'));
            }

            // Find type by ID in the database
            const type = await Type.findByPk(id);

            // Check if type exists
            if (!type) {
                return next(ApiError.badRequest('Type not found'));
            }

            // Return the type as JSON
            return res.json(type);
        } catch (error) {
            // Handle unexpected errors
            return next(ApiError.internal('Error fetching type', { details: error.message }));
        }
    }

    // Retrieve all types
    async getAll(req, res, next) {
        try {
            // Fetch all types from the database
            const types = await Type.findAll();

            // Return the list of types as JSON
            return res.json(types);
        } catch (error) {
            // Handle unexpected errors
            return next(ApiError.internal('Error fetching types', { details: error.message }));
        }
    }

    // Update an existing type
    async update(req, res, next) {
        try {
            // Extract name from request body and ID from parameters
            const { name } = req.body;
            const { id } = req.params;

            // Validate: Ensure ID is a positive integer
            if (!id || isNaN(id) || parseInt(id) <= 0) {
                return next(ApiError.badRequest('Invalid type ID'));
            }

            // Validate: Ensure name is a non-empty string
            if (!name || typeof name !== 'string' || name.trim() === '') {
                return next(ApiError.badRequest('Type name is required and must be a non-empty string'));
            }

            // Validate: Ensure name length does not exceed 50 characters
            if (name.length > 50) {
                return next(ApiError.badRequest('Type name must not exceed 50 characters'));
            }

            // Check if type exists
            const type = await Type.findByPk(id);
            if (!type) {
                return next(ApiError.badRequest('Type not found'));
            }

            // Check if the new name is already taken by another type
            const existingType = await Type.findOne({ where: { name } });
            if (existingType && existingType.id !== parseInt(id)) {
                return next(ApiError.badRequest('Type with this name already exists'));
            }

            // Update type name in the database
            await Type.update({ name: name.trim() }, { where: { id } });

            // Fetch the updated type
            const updatedType = await Type.findByPk(id);

            // Return the updated type as JSON
            return res.json(updatedType);
        } catch (error) {
            // Handle unexpected errors
            return next(ApiError.internal('Error updating type', { details: error.message }));
        }
    }

    // Delete a type by ID
    async delete(req, res, next) {
        try {
            // Extract ID from request parameters
            const { id } = req.params;

            // Validate: Ensure ID is a positive integer
            if (!id || isNaN(id) || parseInt(id) <= 0) {
                return next(ApiError.badRequest('Invalid type ID'));
            }

            // Check if type exists in the database
            const type = await Type.findByPk(id);
            if (!type) {
                return next(ApiError.badRequest('Type not found'));
            }

            // Delete type from the database
            await Type.destroy({ where: { id } });

            // Return success message as JSON
            return res.json({ message: 'Type deleted successfully' });
        } catch (error) {
            // Handle unexpected errors
            return next(ApiError.internal('Error deleting type', { details: error.message }));
        }
    }
}

// Export a new instance of TypeController
export default new TypeController(); // module.exports = new TypeController();