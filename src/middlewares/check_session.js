const path = require("path")
const { middleware_logger } = require(path.join(__dirname, "../logger"))

const check_session = (req, res, next) => {
    middleware_logger.info("checking the session of the user")
    const sessionExpiresAt = req.session.expiresAt;
    const currentTime = Date.now();
    if (sessionExpiresAt && currentTime > sessionExpiresAt) {
        middleware_logger.info("session has expired for " + req.session.username)
        req.session.destroy();
        res.body.expired = true;
    }
    next();
};

module.exports = check_session;