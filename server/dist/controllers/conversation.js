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
exports.get_conversation_users = exports.get_conversation_messages = exports.modify_conversation = exports.get_conversation = exports.leave_conversation = exports.delete_conversation = exports.new_conversation = void 0;
const conversation_1 = __importDefault(require("../db/conversation"));
const logger_1 = require("../logger");
const send_1 = require("../scripts/send");
const user_1 = require("../validators/user");
// POST /api/conversation
// required body : name, user_id
const new_conversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.controller_logger.info("new conversation");
    const { name, users_id } = req.body;
    const admin_id = parseInt(req.headers["X-id"]);
    let conversation, user, conversation_user, user_instances = [], not_found = false;
    if (!name || !users_id)
        (0, send_1.send_error)(res, 400, "Missing parameters");
    else {
        try {
            for (let i = 0; i < users_id.length; i++) {
                if (!(yield (0, user_1.validate_user_id)(users_id[i]))) {
                    logger_1.middleware_logger.info("user " + users_id[i] + " does not exist");
                    not_found = true;
                    break;
                }
            }
            if (not_found)
                (0, send_1.send_error)(res, 404, "One or multiple users do not exist");
            else {
                // Create conversation
                conversation = yield conversation_1.default.create({ name: name, admin_id: admin_id, id: null, creation_date: new Date(), edition_date: new Date() });
                for (let i = 0; i < users_id.length; i++)
                    yield conversation.add_user(users_id[i]);
                yield conversation.add_user(admin_id);
                yield conversation.save();
                (0, send_1.send_result)(res, 201, conversation);
            }
        }
        catch (err) {
            logger_1.controller_logger.error(err);
            (0, send_1.send_error)(res, 500, "Server error");
        }
    }
});
exports.new_conversation = new_conversation;
// DELETE /api/conversation/{id}
const delete_conversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user_id = parseInt(req.headers["X-id"]);
    logger_1.controller_logger.info("delete conversation " + id);
    try {
        // Find the conversation
        const conversation = yield conversation_1.default.findByPk(id);
        if (!conversation)
            (0, send_1.send_error)(res, 404, "Conversation not found");
        else if (conversation.dataValues.admin_id != user_id)
            (0, send_1.send_error)(res, 401, "Unauthorized");
        else {
            yield conversation.delete();
            (0, send_1.send_success)(res);
        }
    }
    catch (err) {
        logger_1.controller_logger.error(err);
        (0, send_1.send_error)(res, 500, "Server error");
    }
});
exports.delete_conversation = delete_conversation;
// DELETE /api/conversation/{id}/leave
const leave_conversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user_id = parseInt(req.headers["X-id"]);
    logger_1.controller_logger.info("user " + user_id + " leaves conversation " + id);
    try {
        // Find the conversation
        const conversation = yield conversation_1.default.findByPk(id);
        if (!conversation)
            (0, send_1.send_error)(res, 404, "Conversation not found");
        else {
            yield conversation.remove_user(user_id);
            (0, send_1.send_success)(res);
        }
    }
    catch (err) {
        logger_1.controller_logger.error(err);
        (0, send_1.send_error)(res, 500, "Server error");
    }
});
exports.leave_conversation = leave_conversation;
// GET /api/conversation/{id}
const get_conversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    logger_1.controller_logger.info("get conversation " + id);
    try {
        const conversation = yield conversation_1.default.findByPk(id);
        if (!conversation)
            (0, send_1.send_error)(res, 404, "Conversation not found");
        else {
            (0, send_1.send_result)(res, 200, conversation);
        }
    }
    catch (err) {
        logger_1.controller_logger.error(err);
        (0, send_1.send_error)(res, 500, "Server error");
    }
});
exports.get_conversation = get_conversation;
// PUT /api/conversation/{id}
// required body : name
const modify_conversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { name, removed_users, added_users } = req.body;
    logger_1.controller_logger.info("modifying conversation " + id);
    if (!name)
        (0, send_1.send_error)(res, 400, "Missing parameters");
    else {
        try {
            const conversation = yield conversation_1.default.findByPk(id);
            if (!conversation)
                (0, send_1.send_error)(res, 404, "Conversation not found");
            else {
                conversation.setDataValue("name", name);
                conversation.setDataValue("edition_date", new Date());
                if (removed_users)
                    for (let i = 0; i < removed_users.length; i++)
                        yield conversation.remove_user(removed_users[i]);
                if (added_users)
                    for (let i = 0; i < added_users.length; i++)
                        yield conversation.add_user(added_users[i]);
                yield conversation.save();
                (0, send_1.send_success)(res);
            }
        }
        catch (err) {
            logger_1.controller_logger.error(err);
            (0, send_1.send_error)(res, 500, "Server error");
        }
    }
});
exports.modify_conversation = modify_conversation;
// GET /api/conversation/{id}/message
const get_conversation_messages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    logger_1.controller_logger.info("get conversation " + id + " messages");
    try {
        const conversation = yield conversation_1.default.findByPk(id);
        if (!conversation)
            (0, send_1.send_error)(res, 404, "Conversation not found");
        else {
            const messages = yield conversation.get_messages();
            (0, send_1.send_result)(res, 200, messages);
        }
    }
    catch (err) {
        logger_1.controller_logger.error(err);
        (0, send_1.send_error)(res, 500, "Server error");
    }
});
exports.get_conversation_messages = get_conversation_messages;
// GET /api/conversation/{id}/user
const get_conversation_users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    logger_1.controller_logger.info("get conversation " + id + " users");
    try {
        const conversation = yield conversation_1.default.findByPk(id);
        if (!conversation)
            (0, send_1.send_error)(res, 404, "Conversation not found");
        else {
            const users = yield conversation.get_users();
            const users_filtered = users.map((user) => {
                return {
                    username: user.dataValues.username,
                    permission: user.dataValues.permission,
                    last_connection: user.dataValues.last_connection,
                    creation_date: user.dataValues.creation_date
                };
            });
            (0, send_1.send_result)(res, 200, users_filtered);
        }
    }
    catch (err) {
        logger_1.controller_logger.error(err);
        (0, send_1.send_error)(res, 500, "Server error");
    }
});
exports.get_conversation_users = get_conversation_users;
//# sourceMappingURL=conversation.js.map