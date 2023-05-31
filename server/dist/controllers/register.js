"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../db/user"));
const register_1 = require("../validators/register");
const logger_1 = require("../logger");
const send_1 = require("../scripts/send");
const jwt_1 = require("../scripts/jwt");
const saltRound = 10;
// POST /api/register
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username, password = req.body.password;
    let token, hash, user;
    logger_1.controller_logger.info("register a new user with name " + username);
    if (!username || !password)
        (0, send_1.send_error)(res, 400, "Both username and password are required");
    else if (!(0, register_1.validate_username)(username))
        (0, send_1.send_error)(res, 401, "Username did not meet expectations");
    else if (!(0, register_1.validate_password)(password))
        (0, send_1.send_error)(res, 401, "Password did not meet expectations");
    else {
        try {
            // Verify if user already exists
            user = yield user_1.default.findOne({ where: { username: username } });
            if (user)
                (0, send_1.send_error)(res, 409, "User already exists");
            else {
                // Create user and send token
                hash = yield bcrypt_1.default.hash(password, saltRound);
                user = yield user_1.default.create({ id: null, username: username, password_hash: hash, permission: 0, last_connection: new Date(), creation_date: new Date() });
                yield user.save();
                token = yield (0, jwt_1.createJwt)(user.dataValues.id, user.dataValues.username);
                (0, send_1.send_result)(res, 201, { token: token, username: user.dataValues.username, id: user.dataValues.id });
            }
        }
        catch (err) {
            logger_1.controller_logger.error(err);
            (0, send_1.send_error)(res, 500, "Server error");
        }
    }
});
exports.register = register;
//# sourceMappingURL=register.js.map