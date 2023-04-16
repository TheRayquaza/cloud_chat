const path = require("path")

const validator = require(path.join(__dirname, "../validators/register"))
const request = require(path.join(__dirname, "../db/user"))

const bcrypt = require('bcrypt');
const saltRound = 10;

const jwt = require("jsonwebtoken")


const register = (req, res) => {
    const username = req.body.username
    const password = req.body.password
    if (!username || !password) res.status(400).json({"error" : "validator : Both username and password are required"})
    else if (!validator.validateUsername(username)) res.status(401).json({"error" : "validator : Username did not meet expectations"})
    else if (!validator.validatePassword(password)) res.status(401).json({"error" : "validator : Password did not meet expectations"})
    else
        bcrypt.hash(password, saltRound, (err, hash) => {
            if (err) res.status(500).json({"error" : "controller : unable to hash your profile " + username});
            else
                request.put_user(username, hash, err => {
                    if (err) res.status(500).json({"error" : "db : unable to register a new user"})
                    //request.put_user(username, hash, (err, ))
                    const token = jwt.sign({ userId: user.id }, 'secret-key'); 
                    res.status(200).json({ token: token });
                })
        });
}

module.exports = { register }