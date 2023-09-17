import { Sequelize } from 'sequelize';

// Define a sequelize instance
const sequelize : Sequelize = new Sequelize(
    process.env.NAME_DB as string, // db
    process.env.USERNAME_DB as string, // username
    process.env.PASSWORD_DB as string, // password
    {
        dialect: "mariadb", // dialect (mariadb, mysql, ...)
        host: process.env.HOST_DB as string, // host
        logging: process.env.LOG_DB === "true" ? console.log : false,
    }
);

export default sequelize;