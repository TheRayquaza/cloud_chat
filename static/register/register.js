const server = "localhost:8080"

password_input = document.getElementById("password-input")
username_input = document.getElementById("username-input")
register_btn = document.getElementById("register-btn")

const generic_headers = () => {
    var tmp = new Headers();
    tmp.append("Content-Type", "application/json");
    return tmp;
}

// generic request options
const make_request_options = (method, headers, body = undefined) => {
    if (body)
        return {
            method: method,
            headers: headers,
            redirect: 'follow',
            body : body
        }
    else
        return {
            method : method,
            headers: headers,
            redirect : 'follow',
        }
}

register_btn.addEventListener("click", () => {
    const body = {"username" : username_input.value, "password" : password_input.value}
    fetch(document.location.origin + "/register", make_request_options("POST", generic_headers(), JSON.stringify(body)))
    .then(response => response.json())
    .then(response => {
        if (!response || response.error) $.smackbar({message : response.error ? response.error : "Unable to register you as " + username_input.value});
        else window.location.assign('/chat.html');
    })
})
