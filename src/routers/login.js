const express = require("express")
const path = require("path")
const route = express.Router()
const controller = require(path.join(__dirname, "../controllers/login"))

route.post("/", controller.login)


module.exports = route;