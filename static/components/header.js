const chatLink = document.getElementById('chat-link');
const loginLink = document.getElementById('login-link');
const registerLink = document.getElementById('register-link');
const logoutLink = document.getElementById('logout-link');

if (localStorage.getItem("logged_in")) {
  chatLink.style.display = 'inline-block';
  logoutLink.style.display = 'inline-block';
  loginLink.style.display = 'none';
  registerLink.style.display = 'none';
} else {
  chatLink.style.display = 'none';
  logoutLink.style.display = 'none';
  loginLink.style.display = 'inline-block';
  registerLink.style.display = 'inline-block';
}
