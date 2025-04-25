import ApiError from '../error/ApiError.js'; // const ApiError = require('../error/ApiError');
import { Type } from '../models/models.js';  // const { Type } = require('../models/models');

class TypeController {
    async create(req, res) {  // HTTP request to create a new type
        const {name} = req.body; // extracts the name from the request body
        const type = await Type.create({name}); //The create() method is a built-in method provided by Sequelize that allows you to create a new instance of the model in the database.
        return res.json(type);  // sends the new type back to the client as a JSON response
    }

    async getOne(req, res) {
        const {id} = req.params; // The id is extracted from the request parameters (req.params)
        const type = await Type.findOne({ where: { id } }); // This is a method provided by Sequelize that finds a model instance in the database.
        // const type = await Type.findByPk(id); // This is a method provided by Sequelize that finds a model instance in the database.
        return res.json(type);
        
    }

    async getAll(req, res) {
        const types = await Type.findAll(); // This is a method provided by Sequelize that finds all model instances in the database.
        return res.json(types);
    }
    async update(req, res) {
        const {name} = req.body;
        const {id} = req.params; // Get the id parameter from the request
        await Type.update({ name }, { where: { id } }); // This is a method provided by Sequelize that updates a model instance in the database.
        const type = await Type.findOne({ where: { id } }); // This is a method provided by Sequelize that finds a model instance in the database.
        // const type = await Type.findByPk(id); // This is a method provided by Sequelize that finds a model instance in the database.
        return res.json(type);
      }

    async delete(req, res) {
        
    }
}

export default new TypeController();