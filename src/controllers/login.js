const path = require("path")
const { controller_logger } = require(path.join(__dirname, "../logger"))
const request = require(path.join("../db/user"))
const bcrypt = require("bcrypt")

const login = (req, res, next) => {
    controller_logger.info("login a user")
    const username = req.body.username
    const password = req.body.password
    request.get_user_id(username, get_res => {
        if (!get_res || !get_res.id) 
        {
            controller_logger.error("error in db while retrieving the username")
            res.status(401).json({"error": username + " is invalid"})
        }
        else
            request.get_user(get_res.id, user => {
                bcrypt.compare(password, user.password_hash)
                .then(sucess => {
                    if (!sucess) 
                    {
                        controller_logger.info("The password did not match the hash in db")
                        res.status(401).json({"error": "Password is invalid"})
                    }
                    else
                    {
                        req.session.username = user.username
                        req.session.api_key = user.api_key
                        req.session.id = user.id
                        req.session.expiresAt = Date.now() + 24 * 60 * 60 * 1000
                        res.body = { api_key : user.api_key, id : user.id, username : user.username}
                        next()
                    }
                })
            })
    })
}

module.exports = { login }