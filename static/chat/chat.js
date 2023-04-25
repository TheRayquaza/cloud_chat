const socket = io('http://localhost:8081')

// DOM elements
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')
const messageList = document.getElementById('message-list')
const usersList = document.getElementById('users-list')

// Add new message to the message list
function addMessage(username, message) {
  const li = document.createElement('li')
  li.innerHTML = `<strong>${username}:</strong> ${message}`
  messageList.appendChild(li)
}

// Add new user to the user list
function addUser(username) {
  const li = document.createElement('li')
  li.textContent = username
  li.setAttribute("data-username", username)
  usersList.appendChild(li)
}

// Remove user from the user list
function removeUser(username) {
  const li = document.querySelector(`#users-list li[data-username="${username}"]`)
  li.remove()
}

// Emit a "new message" event
messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value.trim()
  if (message) {
    socket.emit('new message', message)
    messageInput.value = ''
    messageInput.focus()
  }
})

// Emit a "join" event when the user connects
socket.on('connect', () => {
  const username = prompt('Enter your username:')
  if (username) {
    addUser(username)
    socket.emit('join', username)
  }
})

// Add new message when a "new message" event is received
socket.on('new message', ({ username, message }) => {
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
