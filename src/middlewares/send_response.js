const path = require("path")
const { middleware_logger } = require(path.join(__dirname, "../logger"))

const send_response = (req,res,next) => {
    middleware_logger.info("sending response body with status 200")
    res.status(200).json(res.body);
    next();
}

module.exports = send_response;