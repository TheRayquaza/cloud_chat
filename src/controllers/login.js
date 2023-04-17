const path = require("path")
const request = require(path.join("../db/user"))
const bcrypt = require("bcrypt")

const login = (req, res, next) => {
    const id = req.cookies.id
    const password = req.cookies.password
    request.get_user(id, user => {
        if (!user) res.status(500).json({"error": "Unable to login user " + id})
        else
            bcrypt.compare(password, user.password_hash)
            .then(sucess => {
                if (!sucess) res.status(401).json({"error": "Password is invalid"})
                else
                {
                    res.body.api_key = user.api_key;
                    next()
                }
            })
    })
}

module.exports = { login }