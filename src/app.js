const express = require("express")
const path = require("path")
const express_session = require("express-session")

const login_route = require(path.join(__dirname, '/routers/login'))
const register_route = require(path.join(__dirname, "/routers/register"))
const user_route = require(path.join(__dirname, "/routers/user"))

const middleware_make_response = require(path.join(__dirname, "/middlewares/make_response"))
const middleware_send_response = require(path.join(__dirname, "/middlewares/send_response"))
const middleware_log_entry = require(path.join(__dirname, "/middlewares/log_entry"))
const middleware_log_response = require(path.join(__dirname, "/middlewares/log_response"))
const middleware_check_session = require(path.join(__dirname, "/middlewares/check_session"))

const app = express()

// Static html, css and js
app.use(express.static('static'))
// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session saver
app.use(express_session({
    secret : "4etB69lNgUBgOZA16GrLRXvRHwIo6VW1W1Htv702tSPJUd1sZB0wdg/OyWhUCbROo4JF0dnMN5hJ+DaBb2F64Q",
    saveUninitialized: false,
    resave : false,
    cookie: { secure: true, maxAge: 24 * 60 * 60 * 1000}
}));

// Check the session
app.use(middleware_check_session)

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

module.exports = app