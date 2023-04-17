const express = require("express")
const router = express.Router()
const path = require("path")
const controller = require(path.join(__dirname, "../controllers/user"))
const middleware_permissions = require(path.join(__dirname, "../middlewares/user_permissions"))


router.use(middleware_permissions)

router.get("/:id", controller.get_user)
router.delete("/:id", controller.delete_user)
//router.post("/", controller.post_user)

module.exports = router