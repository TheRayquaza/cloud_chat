import { Sequelize } from 'sequelize';

// Define a sequelize instance
const sequelize = new Sequelize(
    process.env.NAME_DB, // db
    process.env.USERNAME_DB, // username
    process.env.PASSWORD_DB, // password
    {
        host: process.env.HOST_DB, // host
        dialect: process.env.TYPE_DB, // dialect (mariadb, mysql, ...)
        logging: process.env.LOG_DB === "true" ? console.log : false,
    }
);

export default sequelize;