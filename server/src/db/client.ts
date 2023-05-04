import { Sequelize, Dialect } from 'sequelize';

// Define a sequelize instance
const sequelize = new Sequelize(
    process.env.NAME_DB as string, // db
    process.env.USERNAME_DB as string, // username
    process.env.PASSWORD_DB as string, // password
    {
        host: process.env.HOST_DB as string, // host
        dialect: process.env.TYPE_DB as Dialect, // dialect (mariadb, mysql, ...)
        logging: process.env.LOG_DB === "true" ? console.log : false,
    }
);

export default sequelize;