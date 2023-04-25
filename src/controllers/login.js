const path = require("path")
const request = require(path.join("../db/user"))
const bcrypt = require("bcrypt")

const login = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    request.get_user_id(username, get_res => {
        if (!get_res || !get_res.id) res.status(401).json({"error": username + " not found"})
        else
            request.get_user(get_res.id, user => {
                bcrypt.compare(password, user.password_hash)
                .then(sucess => {
                    if (!sucess) res.status(401).json({"error": "Password is invalid"})
                    else
                    {
                        req.session.username = username;
                        req.session.api_key = user.api_key;
                        req.session.id = user.id;
                        req.session.expiresAt = Date.now() + 24 * 60 * 60 * 1000;
                        res.body.api_key = user.api_key;
                        next()
                    }
                })
            })
    })
}

module.exports = { login }