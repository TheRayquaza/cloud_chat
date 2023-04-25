const path = require("path")
const app = require(path.join(__dirname, "/../app.js"))
const SocketHandler = require(path.join(__dirname, "/socket_handler"))

const http = require("http")
const server = http.createServer(app)

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:8080"
  }
})

const socketHandler = new SocketHandler(io)

io.on("connection", (socket) => {
  socketHandler.handleConnection(socket)
})


module.exports = server