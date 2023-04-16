const express = require("express")
const path = require("path")

const login_route = require(path.join(__dirname, '/src/routers/login'))
const register_route = require(path.join(__dirname, "/src/routers/register"))

const app = express()
const port = 80

app.use(express.static('static'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/login", login_route)
app.use("/register", register_route)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/static/login/login.html'))   
})

app.listen(port, () => {
    console.log("Listening on " + port)
})
