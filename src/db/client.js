const mysql = require('mysql2/promise');
const path = require("path")
const pool_settings = require(path.join(__dirname, "/settings")).pool_settings

module.exports = mysql.createPool(pool_settings);