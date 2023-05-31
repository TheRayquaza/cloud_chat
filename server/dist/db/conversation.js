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
const sequelize_1 = require("sequelize");
const client_1 = __importDefault(require("./client"));
const conversation_user_1 = __importDefault(require("./conversation_user"));
const user_1 = __importDefault(require("./user"));
const message_1 = __importDefault(require("./message"));
class Conversation extends sequelize_1.Model {
    // Get all users from this conversation
    get_users() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = [];
            const conversation_users = yield conversation_user_1.default.findAll({ where: { conversation_id: this.dataValues.id } });
            for (let i = 0; i < conversation_users.length; i++)
                if (conversation_users[i] && conversation_users[i].dataValues.user_id) {
                    const user = yield user_1.default.findByPk(conversation_users[i].dataValues.user_id);
                    if (user)
                        res.push(user);
                }
            return res;
        });
    }
    // Get all messages from this conversation
    get_messages() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(this.dataValues);
            return yield message_1.default.findAll({ where: { conversation_id: this.dataValues.id } });
        });
    }
    // Get all messages from this conversation
    get_messages_from_user(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield message_1.default.findAll({ where: { conversation_id: this.dataValues.id, user_id: user_id } });
        });
    }
    // Get all conversation users from this conversation
    get_conversation_users() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield conversation_user_1.default.findAll({ where: { conversation_id: this.dataValues.id } });
        });
    }
    // Get admin from this conversation
    get_admin() {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield user_1.default.findByPk(this.dataValues.admin_id);
            if (admin)
                return admin;
            else
                throw new Error("Admin not found");
        });
    }
    // POST / PUT
    // Add user to the conversation
    add_user(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let conversation_user = yield conversation_user_1.default.findOne({ where: { user_id: user_id, conversation_id: this.dataValues.id } });
            if (!conversation_user) {
                conversation_user = yield conversation_user_1.default.create({ user_id: user_id, conversation_id: this.dataValues.id, id: null });
                yield conversation_user.save();
            }
        });
    }
    // Add message to conversation
    add_message(user_id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield message_1.default.create({ user_id: user_id, conversation_id: this.dataValues.id, content: content, id: null, creation_date: new Date(), edition_date: new Date() });
            yield message.save();
            return message;
        });
    }
    // DELETE
    // Remove user from the conversation
    remove_user(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversation_user = yield conversation_user_1.default.findOne({ where: { user_id: user_id, conversation_id: this.dataValues.id } });
            if (conversation_user)
                yield conversation_user.delete();
            yield this.delete_messages_from_user(user_id);
        });
    }
    // Delete message from conversation from a specific user
    delete_messages_from_user(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield this.get_messages_from_user(user_id);
            for (let i = 0; i < messages.length; i++)
                yield messages[i].destroy();
        });
    }
    // Delete this conversation
    // - Delete conversation users from this conversation
    // - Delete all messages from this conversation
    // - Delete this conversation
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            // Delete conversation users from this conversation
            const conversation_users = yield this.get_conversation_users();
            for (let i = 0; i < conversation_users.length; i++)
                yield conversation_users[i].destroy();
            // Delete all messages from this conversation
            const messages = yield this.get_messages();
            for (let i = 0; i < messages.length; i++)
                yield messages[i].destroy();
            // Delete this conversation
            yield this.destroy();
        });
    }
}
Conversation.init({
    admin_id: { type: sequelize_1.DataTypes.BIGINT.UNSIGNED, allowNull: false },
    id: { type: sequelize_1.DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: sequelize_1.DataTypes.STRING(255), allowNull: false },
    creation_date: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    edition_date: { type: sequelize_1.DataTypes.DATE, allowNull: false },
}, {
    timestamps: false,
    tableName: process.env.NAME_TABLE_CONVERSATION_DB,
    sequelize: client_1.default,
});
exports.default = Conversation;
//# sourceMappingURL=conversation.js.map