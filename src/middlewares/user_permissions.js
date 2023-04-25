const path = require("path")
const request = require(path.join("../db/user"))
const { middleware_logger } = require(path.join(__dirname, "../logger"))

const user_permissions = (req, res, next) => {
    middleware_logger.info("user permissions")
    const id = req.cookies.id
    const api_key = req.cookies.api_key
    request.get_user(id, user => {
        if (user && user.permission == 1 && user.api_key == api_key) next()
        else 
        {
            middleware_logger.info("the user has not been authorized to access the protected part of the API")
            res.status(401).json({"error" : "Unauthorized access"})
        }
    })
}

module.exports = user_permissions