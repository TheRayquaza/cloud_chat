const express = require("express")
const path = require("path")
const router = express.Router()

const controller = require(path.join(__dirname, "../controllers/register"))

router.post("/", controller.register)

module.exports = router