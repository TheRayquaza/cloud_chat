const { controller_logger } = require("../logger")
const User = require("../db/user")
const { send_error, send_result } = require("../scripts/send")
const { createJwt } = require("../scripts/jwt")
const bcrypt = require("bcrypt")

const login = (req, res) => {
    controller_logger.info("login a user")
    const { username, password } = req.body

    if (!username || !password)
        send_error(res, 400, "Username or password not provided")

    User.findOne({where : {username : username}})
    .then(user => {
        if (!user) 
        {
            send_error(res, 401, username + " does not exist")
            return Promise.reject("user already exists")
        }

        bcrypt.compare(password, user.password_hash)
        .then(success => {
            if (!success) send_error(res, 401, "Password is invalid")
            else
                createJwt(user.id, user.username, token => {
                    send_result(res, 200, { token : token })
                })
        })
    })
    .catch(err => {
        controller_logger.error(err)
        send_result(res, 500, "Server error")
    })
}

module.exports = { login }