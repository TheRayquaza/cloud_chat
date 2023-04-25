const path = require("path")
const { ws_logger } = require(path.join(__dirname, "../logger"))

class UserHandler {
  constructor(io, users) {
    this.io = io
    this.users = users
  }

  handleJoin = socket  => {
    ws_logger.info(`${socket.username} joined`)
    this.users.forEach(socket_user => socket_user.emit("user join", socket.username))
    for (var i = 0; i < this.users.lenght; i++)
    {
      if (this.users.username === socket.username)
      {
        ws_logger.info()
        this.users[i].emit("quit")
        this.users.splice(i, 1);
        i--
      }
    }
    this.users.push(socket)
  }

  handleDisconnect = socket => {
    ws_logger.info(`${socket.username} left`)
    this.users.delete(socket)
    this.users.forEach(socket_user => socket_user.emit("user left", socket.username))
    this.io.emit("left")
  }
}

module.exports = UserHandler