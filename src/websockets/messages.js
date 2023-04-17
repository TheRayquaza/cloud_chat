const app = require(path.join(__dirname, "../../../main.js"));
const io = require("socket.io")(app);

io.on("connection", (socket) => {
  console.log("[socket] a user connected");

  socket.on("new message", ({ username, message }) => {
    console.log(`${username}: ${message}`);
    // Add code here to save the message to your database or broadcast it to other clients
    socket.broadcast.emit("new message", { username, message });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
