"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// Define a sequelize instance
const sequelize = new sequelize_1.Sequelize(process.env.NAME_DB, // db
process.env.USERNAME_DB, // username
process.env.PASSWORD_DB, // password
{
    dialect: "mariadb",
    host: process.env.HOST_DB,
    logging: process.env.LOG_DB === "true" ? console.log : false,
});
exports.default = sequelize;
//# sourceMappingURL=client.js.map