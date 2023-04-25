const path = require("path")
const { controller_logger } = require(path.join(__dirname, "../logger"))
const validator = require(path.join(__dirname, "../validators/register"))
const request = require(path.join(__dirname, "../db/user"))
const key_generation = require(path.join(__dirname, "../scripts/key_generation"))

const bcrypt = require('bcrypt')
const saltRound = 10

const register = (req, res, next) => {
    controller_logger.info("register a new user")

    const username = req.body.username
    const password = req.body.password

    if (!username || !password)
    {
        controller_logger.info("bad request, the username or the password is missing")
        res.status(400).json({"error": "Both username and password are required"})
    }
    else if (!validator.validate_username(username)) 
    {
        controller_logger.info("the username is not valid")
        res.status(401).json({"error": "Username did not meet expectations"})
    }
    else if (!validator.validate_password(password)) 
    {
        controller_logger.info("the password is not valid")
        res.status(401).json({"error": "Password did not meet expectations"})
    }
    else
        bcrypt.hash(password, saltRound, (err, hash) => {
            if (err) 
            {
                controller_logger.error("the hash of the password could not be achevied")
                res.status(500).json({"error": "Unable to hash your profile " + username})
            }
            else
                key_generation(64).then(key => {
                    request.put_user(username, hash, key, put_res => {
                        if (!put_res) 
                        {
                            controller_logger.info("the username already exists in db")
                            res.status(500).json({"error": "User already exists"})
                        }
                        else
                            request.get_user_id(username, id => {
                                if (!id) 
                                {
                                    controller_logger.error("unable to get user with its id")
                                    res.status(500).json({"error": "Unbale to retrieve info from user " + username})
                                }
                                else 
                                {
                                    req.session.username = username
                                    req.session.api_key = key
                                    req.session.id = id
                                    req.session.expiresAt = Date.now() + 24 * 60 * 60 * 1000
                                    res.body.id = id
                                    res.body.api_key = key
                                    res.body.username = username
                                    controller_logger.info("sending request back to the client")
                                    next()
                                }
                            })
                    })
                })
        })
}

module.exports = { register }