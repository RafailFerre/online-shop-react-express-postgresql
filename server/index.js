/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import 'dotenv/config'; // const dotenv = require('dotenv/config');
import express from 'express'; // const express = require('express');
import cors from 'cors'; // const cors = require('cors');

import sequelize, { initializeDatabase } from './config/db.js'; // import sequelize and initializeDatabase from db.js // const { sequelize, initializeDatabase } = require('./db');

import path from 'path';
import { fileURLToPath } from 'url';

import routes from './routes/index.js'; // import main router as routes from routes folder  // const router = require('./routes/index');
import errorHandler from './middleware/ErrorHandlingMiddleware.js';  // const errorHandler = require('./middleware/ErrorHandlingMiddleware');

// import { User, Basket, BasketDevice, Device, Type, Brand, DeviceInfo, Rating, TypeBrand, Order, OrderDevice } from './models/models.js'; // const { User, Basket, BasketDevice, Device, Type, Brand, DeviceInfo, Rating, TypeBrand } = require('./models/models');


const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));  // Resolve __dirname for ES Modules

const app = express();  // create express app

app.use(cors()); // make requests from client (browser)
app.use(express.json()); // make requests from client (browser) as json (parse JSON request bodies)
app.use('/static', express.static(path.join(__dirname, 'static'))); // Serve static files from baseurl/static/images/...
app.use('/api', routes); // connect routers to app

app.use(errorHandler); // error handler registration

const start = async () => {
    try {
        await initializeDatabase(); // Initialize database
        // await sequelize.authenticate(); // Attempt to authenticate database connection
        // console.log('Connection has been established successfully.');
        // await sequelize.sync({ alter: true }) // Sync database and update (add or remove columns) tables with models    await sequelize.sync(); // Sync database tables with models     
        // console.log('Database synchronized successfully');
        
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Start server listening on specified port
    } catch (error) {
        console.log(error); // Log any errors that occur during startup
    }
};

start(); // Call start function to begin server startup