const socket = io('http://localhost:8081')

// Global on the chat conversation
const username = localStorage.getItem("username")
const id = localStorage.getItem("id")
var receiver = "mateo"

if (!username || !id) window.location.assign("/login/login.html")

// DOM elements
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')
const messageList = document.getElementById('message-list')
const usersList = document.getElementById('users-list')


// Add new message to the message list
const addMessage = (username, message) => {
  const li = document.createElement('li')
  li.innerHTML = `<strong>${username}:</strong> ${message}`
  messageList.appendChild(li)
}

// Add new user to the user list
const addUser = (username) => {
  const li = document.createElement('li')
  li.textContent = username
  li.setAttribute("data-username", username)
  li.setAttribute("class", "list-group-item d-flex")
  usersList.appendChild(li)
}

// Remove user from the user list
const removeUser = (username) => {
  const li = document.querySelector(`#users-list li[data-username="${username}"]`)
  li.remove()
}

// Emit a "new message" event
messageForm.addEventListener('click', () => {
  const message = messageInput.value.trim()
  if (message) 
  {
    socket.emit('send message', [message, receiver])
    messageInput.value = ''
    messageInput.focus()
  }
})

// Emit a "join" event when the user connects
socket.on('connect', () => {
    if (!localStorage.getItem("logged_in")) window.location.assign("/login/login.html")

    addUser(username)
    socket.emit('join', [id, username])
})

// Add new message when a "new message" event is received
socket.on('receive message', message => {
  addMessage(username, message)
})

// Add new user when a "user joined" event is received
socket.on('user joined', username => {
  addUser(username)
})

// Remove user when a "user left" event is received
socket.on('user left', username => {
  removeUser(username)
})

// Quit socket
socket.on("quit", () => socket.close())

// Left
socket.on("left", () => {
  console.log("left")
})
