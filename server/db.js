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

export default sequelize;
// module.exports = { sequelize };


// export const sequelize = new Sequelize (
//   process.env.DB_NAME, // name of database
//   process.env.DB_USER, // username
//   process.env.DB_PASSWORD, // password
//   {
//     dialect: "postgres",
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     username: "postgres",
//     password: "postgres",
//     database: "postgres",
//   }
// );