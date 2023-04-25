

const check_session = (req, res, next) => {
    const sessionExpiresAt = req.session.expiresAt;
    const currentTime = Date.now();
    if (sessionExpiresAt && currentTime > sessionExpiresAt) {
        req.session.destroy();
        res.body.expired = true;
    }
    next();
};

module.exports = check_session;