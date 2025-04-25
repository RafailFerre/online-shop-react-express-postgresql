import ApiError from '../error/ApiError.js'; // const ApiError = require('../error/ApiError');
import {Brand} from '../models/models.js'; // const {Brand} = require('../models/models');

class BrandController {
    async create(req, res) {
        const {name} = req.body;
        const brand = await Brand.create({name});
        return res.json(brand);
    }
    async getOne(req, res) {
        const {id} = req.params;
        const brand = await Brand.findOne({ where: { id } }); // This is a method provided by Sequelize that finds a model instance in the database.
        return res.json(brand);
    }

    async getAll(req, res) {
        const brands = await Brand.findAll(); // This is a method provided by Sequelize that finds all model instances in the database.
        return res.json(brands);
    }
    async update(req, res) {
       
    }

    async delete(req, res) {
        
    }
}

export default new BrandController();