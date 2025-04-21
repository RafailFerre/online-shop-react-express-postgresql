import 'dotenv/config';
import express from 'express';

import { sequelize } from './db.js';

const app = express();

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await sequelize.authenticate(); // check connection
        console.log('Connection has been established successfully.');
        await sequelize.sync(); // check tables
        console.log('Tables have been created successfully.');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
};

start();