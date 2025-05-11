/* eslint-disable no-undef */
import "dotenv/config";  // const dotenv = require('dotenv/config');
import { Sequelize } from "sequelize";  //const { Sequelize } = require('sequelize') || const Sequelize = require('sequelize').Sequelize;

// Create a new Sequelize instance to connect to the PostgreSQL database.
const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name
  process.env.DB_USER, // Database username
  process.env.DB_PASSWORD, // Database password
  {
    dialect: "postgres", // The dialect of the database. In this case, PostgreSQL.
    host: process.env.DB_HOST, // The hostname or IP address of the database server.
    port: process.env.DB_PORT, // The port number of the database server.
  }
);

// Function to initialize database connection and sync models
export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate(); // Verify database connection
    console.log('Database connection established successfully');
    await sequelize.sync({ alter: true }); // Sync models with database
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error; // Rethrow error to be handled by caller
  }
};

// Initialize database connection and sync models
// (async () => {
//   try {
//     await sequelize.authenticate(); // Verify database connection
//     console.log('Database connection established successfully');
//     await sequelize.sync({ alter: true }); // Sync models with database, update table structures
//     console.log('Database synchronized successfully');
//   } catch (error) {
//     console.error('Error initializing database:', error);
//     process.exit(1); // Exit process on failure
//   }
// })();

export default sequelize;  // module.exports = { sequelize };

