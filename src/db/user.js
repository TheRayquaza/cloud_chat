const path = require("path")
const client = require(path.join(__dirname, "/client"))

const put_user = (username, hash_password) => {
    client.query('INSERT INTO users (username, hash_password) VALUES (?, ?)', [username, hash_password], (err, results) => {
        if (err) throw err;
        console.log('db : User added to database');
    });
}

const get_userId = (username) => {
    client.query("SELECT user_id FROM user WHERE username = " + username)
    .then(rows => {
        return rows[0]
    })
    .catch(err => console.log("db : " + err))
}

module.exports = {
    get_userId,
    put_user
}