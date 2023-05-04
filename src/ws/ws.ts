const path = require("path")
const SocketHandler = require(path.join(__dirname, "/socket_handler"))

const ws_handler = (req, ws) => {
    // TODO check JWT
    // TODO handle connection in a structure
}

module.exports = ws_handler