const password_input = document.getElementById("password-input")
const username_input = document.getElementById("username-input")
const register_btn = document.getElementById("register-btn")

const register = (body) =>
    fetch(document.location.origin + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(body)
    })

register_btn.addEventListener("click", () => {
    register({"username" : username_input.value, "password" : password_input.value})
    .then(response => response.json())
    .then(response => {
        if (!response || response.error) $.smackbar({message : response.error ? response.error : "Unable to register you as " + username_input.value})
        else 
        {
            localStorage.setItem("username", response.username)
            localStorage.setItem("api_key", response.api_key)
            localStorage.setItem("id", response.id)
            localStorage.setItem("logged_in", true)
            window.location.assign('/chat/chat.html')
        }
    })
})
