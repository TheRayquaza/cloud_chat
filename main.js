const path = require("path")
const server_ws = require(path.join(__dirname, "/src/ws/ws.js"))
const app = require(path.join(__dirname, "/src/app.js"))

const port = 8080
const port_ws = 8081

server_ws.listen(port_ws, () => {
  console.log(`WebSocket communications running on port ${port_ws}`)
})

app.listen(port, () => {
    console.log(`API communications running on port ${port}`)
})