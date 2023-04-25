const path = require("path")
const request = require(path.join(__dirname, "../db/user"))
const { controller_logger } = require(path.join(__dirname, "../logger"))


const get_user = (req, res, next) => {
    controller_logger.info("[controller] get user")
    const id = req.params.id
    request.get_user(id, user => {
        if (!user) 
        {
            controller_logger.info("unable to get user with id " + id)
            res.status(500).json({"error" : "Unable to get the user " + id})
        }
        else
        {
            res.body = user
            next()
        }
    })
}

const delete_user = (req, res, next) => {
    controller_logger.info("[controller] delete user")
    const id = req.params.id
    request.delete_user(id, delete_res => {
        if (!delete_res) 
        {
            controller_logger.info("unable to delete user with id " + id)
            res.status(500).json({"error" : "Unable to delete the user " + id})
        }
        else
        {
            res.body.success = true
            next()
        }
    })
}

module.exports = {
    get_user, 
    delete_user
}