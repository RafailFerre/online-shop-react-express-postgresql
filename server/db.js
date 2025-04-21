import { Sequelize } from "sequelize";

 export const sequelize = new Sequelize (
    process.env.DB_NAME, // name of database
    process.env.DB_USER, // username
    process.env.DB_PASSWORD, // password
    {
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: "postgres",
    password: "postgres",
    database: "postgres",
});