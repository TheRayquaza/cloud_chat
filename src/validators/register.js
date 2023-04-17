const validate_username = username => {
    return username.length >= 6;
}
  
const validate_password = password => {
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /\d/;
    return password.length >= 8 && uppercaseRegex.test(password) && numberRegex.test(password);
}

module.exports = {
    validate_password,
    validate_username
}