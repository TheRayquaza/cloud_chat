const make_response = (req, res, next) => {
    res.body = {};
    next();
}

module.exports = make_response;