"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate_password = exports.validate_username = void 0;
const validate_username = (username) => {
    return username.length >= 5;
};
exports.validate_username = validate_username;
const validate_password = (password) => {
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /\d/;
    return password.length >= 8 && uppercaseRegex.test(password) && numberRegex.test(password);
};
exports.validate_password = validate_password;
//# sourceMappingURL=register.js.map