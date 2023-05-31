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
exports.modify_message = exports.get_message = exports.delete_message = exports.new_message = void 0;
const message_1 = __importDefault(require("../db/message"));
const conversation_1 = __importDefault(require("../db/conversation"));
const user_1 = __importDefault(require("../db/user"));
const conversation_user_1 = __importDefault(require("../db/conversation_user"));
const { controller_logger } = require("../logger");
const { send_error, send_result, send_success } = require("../scripts/send");
// POST /api/message
// required body : content, user_id, conversation_id
const new_message = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    controller_logger.info("New message");
    let conversation, user, conversation_user;
    const { conversation_id, content } = req.body;
    const user_id = req.headers["X-id"];
    if (!conversation_id || !content)
        send_error(res, 400, "Missing parameters");
    else {
        try {
            conversation = yield conversation_1.default.findByPk(conversation_id);
            user = yield user_1.default.findByPk(user_id);
            if (!conversation || !user)
                send_error(res, 404, "Conversation or user not found");
            else {
                conversation_user = yield conversation_user_1.default.findOne({ where: { conversation_id: conversation_id, user_id: user_id } });
                if (!conversation_user)
                    send_error(res, 404, "User not in conversation");
                else {
                    let user_id_number = parseInt(user_id, 10);
                    const message = yield conversation.add_message(user_id_number, content);
                    send_result(res, 201, message);
                }
            }
        }
        catch (err) {
            controller_logger.error(err);
            send_error(res, 500, "Server error");
        }
    }
});
exports.new_message = new_message;
// DELETE /api/message/{id}
const delete_message = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    controller_logger.info("Delete message");
    try {
        const id = req.params.id;
        controller_logger.info("delete message " + id);
        const nb = yield message_1.default.destroy({ where: { id: id } });
        if (nb === 0)
            send_error(res, 404, "Message not found");
        else
            send_success(res, 200);
    }
    catch (err) {
        controller_logger.error(err);
        send_error(res, 500, "Server error");
    }
});
exports.delete_message = delete_message;
// GET /api/message/{id}
const get_message = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    controller_logger.info("Get Message");
    const id = req.params.id;
    try {
        let message;
        message = yield message_1.default.findByPk(id);
        if (!message)
            send_error(res, 404, "Message not found");
        else
            send_result(res, 200, message);
    }
    catch (err) {
        controller_logger.error(err);
        send_error(res, 500, "Server error");
    }
});
exports.get_message = get_message;
// PUT /api/message/{id}
// required body : content
const modify_message = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    controller_logger.info("Modify message");
    try {
        const id = req.params.id;
        controller_logger.info("modifying message " + id);
        const { content } = req.body;
        let message = yield message_1.default.findByPk(id);
        if (!message)
            send_error(res, 404, "Message not found");
        else {
            message.setDataValue("content", content);
            message.setDataValue("edition_date", new Date());
            yield message.save();
            send_result(res, 200, message);
        }
    }
    catch (err) {
        controller_logger.error(err);
        send_error(res, 500, "Server error");
    }
});
exports.modify_message = modify_message;
//# sourceMappingURL=message.js.map