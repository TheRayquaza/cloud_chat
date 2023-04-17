const path = require("path")
const client = require(path.join(__dirname, "/client"))
const table = require(path.join(__dirname, "../db/settings")).tables.users

const put_user = (username, hash_password, api_key, callback) => {
    console.log("[db] put a new user")
    client.query("INSERT INTO " + table + "(username, password_hash, api_key, permission) VALUES (?, ?, ?, ?)", [username, hash_password, api_key, 0])
    .then(res => callback(true))
    .catch(err => callback(false))
}

const get_user = (id, callback) => {
    console.log("[db] get user " + id)
    client.query("SELECT * FROM " + table + " WHERE id = (?)", [id])
    .then(res => callback(res[0].length == 0 ? undefined : res[0][0]))
    .catch(err => console.log(err))
}

const get_user_id = (username, callback) => {
    console.log("[db] get user by its username " + username)
    client.query("SELECT * FROM " + table + " WHERE username = (?)", [username])
    .then(res => callback(res[0].length == 0 ? undefined : res[0][0]))
    .catch(err => console.log(err))
}

const delete_user = (id, callback) => {
    console.log("[db] delete user")
    client.query("DELETE FROM " + table + " WHERE id = (?)", [id])
    .then(res => callback(true))
    .catch(err => callback(false))
}

const get_api_key_validity = (api_key, callback) => {
    console.log("[db] verify the validity of the key")
    client.query("SELECT * FROM " + table + " WHERE api_key = (?)", [api_key])
    .then(res => callback(res[0].length == 0))
    .catch(err => callback(false))
}


module.exports = {
    get_user,
    delete_user,
    put_user,
    get_api_key_validity,
    get_user_id
}