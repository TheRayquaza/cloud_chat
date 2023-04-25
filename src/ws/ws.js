const path = require("path")
const app = require(path.join(__dirname, "/../app.js"))
const http = require("http")

const server = http.createServer(app)
const io = require("socket.io")(server)

io.on("connection", (socket) => {
    console.log("a user connected");
  
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  
    socket.on("new message", (msg) => {
      console.log("message: " + msg);
      io.emit("new message", { username: "server", message: msg });
    });
  
    socket.on("join", (username) => {
      console.log(`${username} joined`);
      socket.username = username;
      io.emit("user joined", username);
    });
  
    socket.on("disconnect", () => {
      console.log(`${socket.username} left`);
      io.emit("user left", socket.username);
    });
  });

module.exports = io