const { middleware_logger } = require("../logger")

log_entry = (req, res, next) => {
    middleware_logger.info(
        `Incoming request to ${req.originalUrl}\n` +
        `-> Headers:${JSON.stringify(req.headers)}\n` +
        `-> Body:${JSON.stringify(req.body)}`
    )
  
    next()
}

module.exports = log_entry