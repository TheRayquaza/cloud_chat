
const logout = () =>
  // Send a POST request to /logout endpoint
  fetch(document.location.origin + "/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json"}
  })

// Get the logout button element by ID
const logout_btn = document.getElementById("logout-btn");

// Add an event listener to the logout button
logout_btn.addEventListener("click", () =>
    logout()
    .then(response => response.json())
    .then(response => {
        if (!response || response.error) $.smackbar({message : response.error ? response.error : "Unable to logout to " + localStorage.getItem("username")})
        else
        {
            localStorage.removeItem("username")
            localStorage.removeItem("api_key")
            localStorage.removeItem("logged_in")
            window.location.assign("/login/login.html")
        }
    })
)
