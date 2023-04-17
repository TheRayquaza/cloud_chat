const send_response = (req,res,next) => {
    res.status(200).json(res.body);
    next();
}

module.exports = send_response;