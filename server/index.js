// import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { sequelize } from './db.js';

import routes from './routes/index.js'; // import main router as routes from routes folder
import errorHandler from './middleware/ErrorHandlingMiddleware.js';

import { User, Basket, BasketDevice, Device, Type, Brand, DeviceInfo, Rating, TypeBrand } from './models/models.js';

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors()); // make requests from client (browser)
app.use(express.json()); // parse json

app.use('/api', routes); // connect routers to app

app.use(errorHandler); // error handler registration

const start = async () => {
    try {
        await sequelize.authenticate(); // Attempt to authenticate database connection
        console.log('Connection has been established successfully.');
        await sequelize.sync(); // Sync database tables with models
        // console.log('Tables have been created successfully.');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Start server listening on specified port
    } catch (error) {
        console.log(error); // Log any errors that occur during startup
    }
};

start(); // Call start function to begin server startup