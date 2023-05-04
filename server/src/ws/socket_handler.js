const path = require("path")
const UserHandler = require("./user_handler")
const MessageHandler = require("./message_handler")
const { ws_logger } = require(path.join(__dirname, "../logger"))


class wsHandler {
  constructor(req, ws) {
    this.req = req
    this.ws = ws
    this.users = []
    this.userHandler = new UserHandler(ws, req, this.users)
    this.messageHandler = new MessageHandler(ws, req, this.users)
  }

  handleConnection = (ws) => {
    ws_logger.info("user connected")

    ws.on("join", data => {
      ws.username = data[1]
      ws.id = data[0]
      ws_logger.info("the user " + ws.username + " with id " + ws.id + " joined")
      this.userHandler.handleJoin(ws)
    })

    ws.on("left", () => {
      ws_logger.info("the user " + ws.username + " left")
      this.userHandler.handleLeft(ws)
    })

    ws.on("send message", data => {
      const message = data[0]
      const receiver = data[1] 
      ws_logger.info("the user " + ws.username + " sent a new message to " + receiver + " with content : " + message)
      this.messageHandler.handleSendMessage(ws, message, receiver)
    })
  }
}

module.exports = wsHandler