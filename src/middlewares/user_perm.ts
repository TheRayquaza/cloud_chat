const User = require("../db/user")
const {middleware_logger} = require("../logger")
const {send_error} = require("../scripts/send")

const user_perm = (req, res, next) => {
    middleware_logger.info("user permissions")
    const id = req.id

    User.findByPk(id)
        .then(user => {
            if (user && user.permission === 1) next()
            else send_error(res, 401, "Unauthorized access")
        })
}

module.exports = user_perm