const express = require("express")
const path = require("path")
const cookie = require("cookie-parser")


const login_route = require(path.join(__dirname, '/src/routers/login'))
const register_route = require(path.join(__dirname, "/src/routers/register"))
const user_route = require(path.join(__dirname, "/src/routers/user"))

const middleware_make_response = require(path.join(__dirname, "/src/middlewares/make_response"))
const middleware_send_response = require(path.join(__dirname, "/src/middlewares/send_response"))
const middleware_log_entry = require(path.join(__dirname, "/src/middlewares/log_entry"))
const middleware_log_response = require(path.join(__dirname, "/src/middlewares/log_response"))

const app = express()
const port = 8080

// Middlewares from express
app.use(express.static('static'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookie())

// Create a response body
app.use(middleware_make_response)

// Log the entry
app.use(middleware_log_entry)

// API
app.use("/login", login_route)
app.use("/register", register_route)
app.use("/user", user_route)

// Default route
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/static/login/login.html')))

// Log the response
app.use(middleware_log_response)

// Send response middleware
app.use(middleware_send_response)


app.listen(port, () => console.log("Listening on " + port))

module.exports = app