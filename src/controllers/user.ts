const User = require(path.join(__dirname, "../db/user"))
const { controller_logger } = require(path.join(__dirname, "../logger"))
const { send_error, send_result, send_success } = require(path.join(__dirname, "../scripts/send"))

const bcrypt = require('bcrypt')
const saltRound = 10

// GET /api/user/{id}
const get_user = (req, res) => {
    controller_logger.info("get user")
    const id = req.params.id

    if (!id) res.status(400).json({"error" : "bad request, missing id query"})

    User.findByPk(id)
    .then(user => {
        if (!user) 
        {
            controller_logger.info("unable to get user with id " + id)
            send_error(res, 404, "Unable to get the user " + id)
        }
        else send_result(res, user)
    })
    .catch(err => {
        controller_logger.error(err)
        send_error(res, 500, "Unable to access the db")
    })
}

// GET /api/user
const get_all_user = (req, res) => {
    controller_logger.info("get all user")
    User.findAll()
    .then(users => {
        if (!users)
        {
            controller_logger.info("unable to get all users")
            send_error(res, 404, "Unable to get all users")
        }
        else send_result(res, users)
    })
    .catch(err => {
        controller_logger.error(err)
        send_error(res, 500, "Unable to access the db")
    })
}

// DELETE /api/user/{id}
const delete_user = (req, res) => {
    controller_logger.info("delete user")
    const id = req.params.id
    
    if (!id) send_error(400, "Bad request, missing id query") 

    User.destroy({where : { id : id }})
    .then(nb => {
        if (nb === 0)
        {
            controller_logger.info("unable to delete user with id " + id)
            send_error(res, 404, "user " + id + " not found")
        }
        else send_success(res)
    })
    .catch(err => {
        controller_logger.error(err)
        send_error(res, 500, "Unable to access the db")
    })
}

// POST /api/user
// required in req.body : username, password 
const post_user = (req, res) => {
    controller_logger.info("post a new user")

    const username = req.body.username
    const password = req.body.password

    if (!username || !password) send_error(res, 400, "Bad request, username and password required")

    bcrypt.hash(password, saltRound)
    .then(hash => User.create({username: username, password_hash: hash, permission: 0}))
    .then(instance => instance.save())
    .then(() => send_success(res))
    .catch(error => {
        controller_logger.error(error)
        send_error(res, 500, "Unable to access the db")
    })
}

module.exports = {
    get_user, 
    delete_user,
    get_all_user,
    post_user
}