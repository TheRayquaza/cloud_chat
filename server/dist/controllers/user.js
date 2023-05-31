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
exports.get_user_conversations = exports.put_user = exports.post_user = exports.delete_user = exports.get_all_user = exports.get_user = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../db/user"));
const logger_1 = require("../logger");
const send_1 = require("../scripts/send");
const register_1 = require("../validators/register");
const saltRound = 10;
// GET /api/user/{id}
const get_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    logger_1.controller_logger.info("Get user " + id);
    try {
        let user = yield user_1.default.findByPk(id, { attributes: { exclude: ['password_hash'] } });
        if (!user) {
            logger_1.controller_logger.info("Unable to get user with id " + id);
            (0, send_1.send_error)(res, 404, "Unable to get the user " + id);
        }
        else
            (0, send_1.send_result)(res, 200, user);
    }
    catch (err) {
        logger_1.controller_logger.error(err);
        (0, send_1.send_error)(res, 500, "Unable to access the db");
    }
});
exports.get_user = get_user;
// GET /api/user
const get_all_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.controller_logger.info("Get all user");
    try {
        const users = yield user_1.default.findAll({ attributes: { exclude: ['password_hash'] } });
        if (!users) {
            logger_1.controller_logger.info("Unable to get all users");
            (0, send_1.send_error)(res, 404, "Unable to get all users");
        }
        else
            (0, send_1.send_result)(res, 200, users);
    }
    catch (err) {
        logger_1.controller_logger.error(err);
        (0, send_1.send_error)(res, 500, "Unable to access the db");
    }
});
exports.get_all_user = get_all_user;
// DELETE /api/user/{id}
const delete_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.controller_logger.info("Delete user");
    const id = req.params.id;
    try {
        const user = yield user_1.default.findByPk(id);
        if (!user) {
            logger_1.controller_logger.info("Unable to delete user with id " + id);
            (0, send_1.send_error)(res, 404, "Unable to find user " + id);
        }
        else {
            yield user.delete();
            (0, send_1.send_success)(res);
        }
    }
    catch (err) {
        logger_1.controller_logger.error(err);
        (0, send_1.send_error)(res, 500, "Server error");
    }
});
exports.delete_user = delete_user;
// POST /api/user
// required in req.body : username, password 
const post_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    let user, hash;
    logger_1.controller_logger.info("Post a new user with username " + username);
    if (!username || !password)
        (0, send_1.send_error)(res, 400, "Username and password required");
    else if (!(0, register_1.validate_password)(password))
        (0, send_1.send_error)(res, 401, "Password did not meet expectations");
    else if (!(0, register_1.validate_username)(username))
        (0, send_1.send_error)(res, 401, "Username did not meet expectations");
    else {
        try {
            user = yield user_1.default.findOne({ where: { username: username } });
            if (user)
                (0, send_1.send_error)(res, 409, "Username already taken");
            else {
                hash = yield bcrypt_1.default.hash(password, saltRound);
                user = yield user_1.default.create({
                    id: null,
                    username: username,
                    password_hash: hash,
                    permission: 0,
                    last_connection: new Date(),
                    creation_date: new Date()
                });
                yield user.save();
                (0, send_1.send_result)(res, 201, {
                    id: user.dataValues.id,
                    username: user.dataValues.username,
                    permission: user.dataValues.permission,
                    last_connection: user.dataValues.last_connection,
                    creation_date: user.dataValues.creation_date
                });
            }
        }
        catch (err) {
            logger_1.controller_logger.error(err);
            (0, send_1.send_error)(res, 500, "Unable to access the db");
        }
    }
});
exports.post_user = post_user;
// PUT /api/user/{id}
// optional in req.body : username, password
const put_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_modified = parseInt(req.params.id, 10), id = parseInt(req.headers["X-id"], 10);
        const user = yield user_1.default.findByPk(id), user_modified = yield user_1.default.findByPk(id_modified);
        const { username, password, permission } = req.body;
        let no_error = true;
        logger_1.controller_logger.info("Put user " + id);
        if (!user_modified || !user)
            (0, send_1.send_error)(res, 404, "User not found");
        else if (user_modified.dataValues.id != user.dataValues.id && user_modified.dataValues.permission >= user.dataValues.permission)
            (0, send_1.send_error)(res, 403, "Unable to update this user");
        else {
            const update_values = {};
            if (permission && no_error) {
                if (user.dataValues.permission > user_modified.dataValues.permission)
                    update_values["permission"] = permission;
                else {
                    no_error = false;
                    (0, send_1.send_error)(res, 400, "Unable to change the permission of this user");
                }
            }
            if (password && no_error) {
                if ((0, register_1.validate_password)(password))
                    update_values["password_hash"] = yield bcrypt_1.default.hash(password, saltRound);
                else {
                    no_error = false;
                    (0, send_1.send_error)(res, 400, "Password did not meet expectations");
                }
            }
            if (username && no_error) {
                if ((0, register_1.validate_username)(username)) {
                    let any_user = yield user_1.default.findOne({ where: { username: username } });
                    if (!any_user)
                        update_values["username"] = username;
                    else {
                        no_error = false;
                        (0, send_1.send_error)(res, 409, "Username already taken");
                    }
                }
                else {
                    no_error = false;
                    (0, send_1.send_error)(res, 400, "Username did not meet expectations");
                }
            }
            if (no_error) {
                yield user_modified.update(update_values);
                yield user_modified.save();
                (0, send_1.send_success)(res);
            }
        }
    }
    catch (err) {
        logger_1.controller_logger.error(err);
        (0, send_1.send_error)(res, 500, "Server error");
    }
});
exports.put_user = put_user;
// GET /api/user/{id}/conversation
const get_user_conversations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    logger_1.controller_logger.info("get user " + id + " conversations");
    try {
        const user = yield user_1.default.findByPk(id);
        if (!user)
            (0, send_1.send_error)(res, 404, "User not found");
        else {
            const conversations = yield user.get_conversations();
            (0, send_1.send_result)(res, 200, conversations);
        }
    }
    catch (err) {
        logger_1.controller_logger.error(err);
        (0, send_1.send_error)(res, 500, "Server error");
    }
});
exports.get_user_conversations = get_user_conversations;
//# sourceMappingURL=user.js.map