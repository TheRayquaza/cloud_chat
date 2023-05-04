const path = require("path")
const { ws_logger } = require(path.join(__dirname, "../logger"))

class UserHandler {
  constructor(ws, req, users) {
    this.ws = ws
    this.req = req
    this.users = users
  }

  handleJoin = ws  => {
    ws_logger.info(`${ws.username} joined`)
    this.users.forEach(ws_user => ws_user.emit("user join", ws.username))
    for (let i = 0; i < this.users.length; i++)
    {
      if (this.users.username === ws.username)
      {
        ws_logger.info()
        this.users[i].emit("quit")
        this.users.splice(i, 1);
        i--
      }
    }
    this.users.push(ws)
  }

  handleDisconnect = ws => {
    ws_logger.info(`${ws.username} left`)
    this.users.delete(ws)
    this.users.forEach(ws_user => ws_user.emit("user left", ws.username))
    this.ws.emit("left")
  }
}

module.exports = UserHandler