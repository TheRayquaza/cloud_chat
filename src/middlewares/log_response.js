const path = require("path")
const { middleware_logger } = require(path.join(__dirname, "../logger"))

const log_response = (req, res, next) => {
    res.on('finish', () => {
      const responseBody = res.body ? JSON.stringify(res.body) : '';
      const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${responseBody}`;
      middleware_logger.info(message);
    });
    next();
  }

module.exports = log_response;