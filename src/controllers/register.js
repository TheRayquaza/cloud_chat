const path = require("path")

const validator = require(path.join(__dirname, "../validators/register"))
const request = require(path.join(__dirname, "../db/user"))
const key_generation = require(path.join(__dirname, "../scripts/key_generation"))

const bcrypt = require('bcrypt')
const saltRound = 10

const register = (req, res, next) => {
    console.log("[controller] register a new user")
    const username = req.body.username
    const password = req.body.password

    if (!username || !password)
        res.status(400).json({"error": "Both username and password are required"})
    else if (!validator.validate_username(username)) 
        res.status(401).json({"error": "Username did not meet expectations"})
    else if (!validator.validate_password(password)) 
        res.status(401).json({"error": "Password did not meet expectations"})
    else
        bcrypt.hash(password, saltRound, (err, hash) => {
            if (err) res.status(500).json({"error": "Unable to hash your profile " + username})
            else
                key_generation(64).then(key => {
                    request.put_user(username, hash, key, put_res => {
                        if (!put_res) res.status(500).json({"error": "Unable to register a new user"})
                        else
                            request.get_user_id(username, id => {
                                if (!id) res.status(500).json({"error": "Unbale to retrieve info from user " + username})
                                else {
                                    res.cookies = {
                                        "username": username,
                                        "logged_in": true,
                                        "api_key": key,
                                        "id": id
                                    }
                                    res.body.success = true
                                    next()
                                }
                            })
                    })
                })
        })
}

module.exports = { register }