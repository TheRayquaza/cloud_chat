const logout = (req, res, next) => {
    req.session.destroy()
    res.status(200).json({"success" : true})
}

module.exports = { logout }