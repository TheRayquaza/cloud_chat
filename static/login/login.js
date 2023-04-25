const server = "localhost:8080"

password_input = document.getElementById("password-input")
username_input = document.getElementById("username-input")
login_btn = document.getElementById("login-btn")

const login = (body) =>
    fetch(document.location.origin + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
})


login_btn.addEventListener("click", () => {
    login({"username" : username_input.value, "password" : password_input.value})
    .then(response => response.json())
    .then(response => {
        if (!response || response.error) $.smackbar({message : response.error ? response.error : "Unable to login to " + username_input.value})
        else 
        {
            localStorage.setItem("id", response.id)
            localStorage.setItem("username", response.username)
            localStorage.setItem("api_key", response.api_key)
            localStorage.setItem("logged_in", true)
            window.location.assign('/chat/chat.html')
        }
    })
})
