const path = require("path")
const UserHandler = require("./user_handler")
const MessageHandler = require("./message_handler")
const { ws_logger } = require(path.join(__dirname, "../logger"))


class SocketHandler {
  constructor(io) {
    this.io = io
    this.users = new Array()
    this.userHandler = new UserHandler(io, this.users)
    this.messageHandler = new MessageHandler(io, this.users)
  }

  handleConnection = (socket) => {
    ws_logger.info("user connected")

    socket.on("join", data => {
      socket.username = data[1]
      socket.id = data[0]
      ws_logger.info("the user " + socket.username + " with id " + socket.id + " joined")
      this.userHandler.handleJoin(socket)
    })

    socket.on("left", () => {
      ws_logger.info("the user " + socket.username + " left")
      this.userHandler.handleLeft(socket)
    })

    socket.on("send message", data => {
      const message = data[0]
      const receiver = data[1] 
      ws_logger.info("the user " + socket.username + " sent a new message to " + receiver + " with content : " + message)
      this.messageHandler.handleSendMessage(socket, message, receiver)
    })
  }
}

module.exports = SocketHandler