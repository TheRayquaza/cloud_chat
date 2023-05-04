const path = require("path")
const { ws_logger } = require(path.join(__dirname, "../logger"))


class MessageHandler {
  constructor(ws, req, users) {
    this.ws = ws
    this.req = req
    this.users = users
  }

  handleSendMessage = (ws, message, receivers) => {
    receivers.forEach(receiver => {
      this.users.forEach(socket_receiver => {
        if (socket_receiver.username === receiver)
          socket_receiver.emit("receive message", message)
      })
    })
    // TODO add message in a conversation
  }
}

module.exports = MessageHandler