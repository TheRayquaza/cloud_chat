const path = require("path")
const { middleware_logger } = require(path.join(__dirname, "../logger"))

log_entry = (req, res, next) => {
    middleware_logger.info({
      message: `Incoming request to ${req.originalUrl}`,
      body: req.body,
      headers: req.headers
    });
  
    next();
  }

module.exports = log_entry;