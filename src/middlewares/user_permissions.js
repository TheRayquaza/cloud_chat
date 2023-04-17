const path = require("path")
const request = require(path.join("../db/user"))

const user_permissions = (req, res, next) => {
    console.log("[middleware] user permissions")
    const id = req.cookies.id
    const api_key = req.cookies.api_key
    request.get_user(id, user => {
        if (user && user.permission == 1 && user.api_key == api_key) next()
        else res.status(401).json({"error" : "Unauthorized access"})
    })
}

module.exports = user_permissions