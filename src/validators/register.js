const validateUsername = username => {
    return username.length >= 6;
}
  
const validatePassword = password => {
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /\d/;
    return password.length >= 8 && uppercaseRegex.test(password) && numberRegex.test(password);
}

module.exports = {
    validatePassword,
    validateUsername
}