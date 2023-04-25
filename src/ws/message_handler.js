const path = require("path")
const { ws_logger } = require(path.join(__dirname, "../logger"))


class MessageHandler {
  constructor(io, users) {
    this.io = io
    this.users = users
  }

  handleSendMessage = (socket, message, receiver) => {
    this.users.forEach(socket_receiver => {
      if (socket.username === receiver)
        socket_receiver.emit("receive message", message)
    })
    // TODO add message in a conversation
  }
}

module.exports = MessageHandler