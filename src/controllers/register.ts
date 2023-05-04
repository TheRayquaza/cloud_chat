const { controller_logger } = require("../logger")
const validator = require("../validators/register")
const { send_error, send_result } = require("../scripts/send")
const { createJwt } = require("../scripts/jwt")
const User = require("../db/user")

const bcrypt = require('bcrypt')
const saltRound = 10

// POST /api/register
const register = (req, res) => {
    controller_logger.info("register a new user")

    const username = req.body.username
    const password = req.body.password

    if (!username || !password)
        send_error(res, 400, "Both username and password are required")
    else if (!validator.validate_username(username)) 
        send_error(res, 401, "Username did not meet expectations")
    else if (!validator.validate_password(password)) 
        send_error(res, 401, "Password did not meet expectations")

    User.findOne({ where: { username: username } })
    .then(user => {
        if (user) 
        {
            send_error(res, 409, "User already exists")
            return Promise.reject("user already exists")
        }
        return bcrypt.hash(password, saltRound)
    })
    .then(hash =>  User.create({
        username: username,
        password_hash: hash,
        permission: 0,
        last_connection : Date.now()
    }))
    .then(instance => instance.save())
    .then(User.findOne({ where: { username: username } }))
    .then(user => {
        if (!user) 
        {
            send_error(res, 500, "Unable to register the new user")
            return Promise.reject("Unable to register")
        }
        else
            createJwt(user.id, user.username, token => {
                send_result(res, 200, {token : token})
            })
    })
    .catch(err => {
        controller_logger.error(err)
        send_error(res, 500, "Server error")
    })
}

module.exports = { register }