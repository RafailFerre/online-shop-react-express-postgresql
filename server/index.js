import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { sequelize } from './db.js';
import { User, Basket, BasketDevice, Device, Type, Brand, DeviceInfo, Rating, TypeBrand } from './models/models.js';
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors()); // make requests from client (browser)
app.use(express.json()); // parse json

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running...' });
});

const start = async () => {
    try {
        await sequelize.authenticate(); // database connection
        console.log('Connection has been established successfully.');
        await sequelize.sync(); // creates database tables 
        // console.log('Tables have been created successfully.');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
};

start();