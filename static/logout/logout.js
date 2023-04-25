
const logout = () =>
  fetch(document.location.origin + "/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json"}
  })

const logout_btn = document.getElementById("logout-btn")
logout_btn.innerHTML = "Logout from " + localStorage.getItem("username")

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
