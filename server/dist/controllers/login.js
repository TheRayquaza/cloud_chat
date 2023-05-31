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
exports.login = void 0;
const logger_1 = require("../logger");
const send_1 = require("../scripts/send");
const jwt_1 = require("../scripts/jwt");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../db/user"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    let user, token, success;
    logger_1.controller_logger.info("trying to login " + username);
    if (!username || !password)
        (0, send_1.send_error)(res, 400, "Username or password not provided");
    else {
        try {
            user = yield user_1.default.findOne({ where: { username: username } });
            if (!user)
                (0, send_1.send_error)(res, 401, `${username} does not exist`);
            else {
                success = yield bcrypt_1.default.compare(password, user.dataValues.password_hash);
                if (!success)
                    (0, send_1.send_error)(res, 401, "Password is invalid");
                else {
                    token = yield (0, jwt_1.createJwt)(user.dataValues.id, user.dataValues.username);
                    (0, send_1.send_result)(res, 200, { token: token, username: user.dataValues.username, id: user.dataValues.id });
                }
            }
        }
        catch (err) {
            logger_1.controller_logger.error(err);
            (0, send_1.send_error)(res, 500, "Server Error");
        }
    }
});
exports.login = login;
//# sourceMappingURL=login.js.map