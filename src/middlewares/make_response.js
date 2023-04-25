const path = require("path")
const { middleware_logger } = require(path.join(__dirname, "../logger"))

const make_response = (req, res, next) => {
    middleware_logger.info("making response {}")
    res.body = {};
    next();
}

module.exports = make_response;