const path = require("path")
const { controller_logger } = require(path.join(__dirname, "../logger"))

const logout = (req, res, next) => {
    controller_logger.info("logout " + req.session.username)
    req.session.destroy()
    res.status(200).json({"success" : true})
}

module.exports = { logout }