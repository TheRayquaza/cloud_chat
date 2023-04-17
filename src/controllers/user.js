const path = require("path")
const request = require(path.join(__dirname, "../db/user"))


const get_user = (req, res, next) => {
    console.log("[controller] get user")
    const id = req.params.id
    request.get_user(id, user => {
        if (!user) res.status(500).json({"error" : "Unable to get the user " + id})
        else
        {
            res.body = user
            next()
        }
    })
}

const delete_user = (req, res, next) => {
    console.log("[controller] delete user")
    const id = req.params.id
    request.delete_user(id, delete_res => {
        if (!delete_res) res.status(500).json({"error" : "Unable to delete the user " + id})
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