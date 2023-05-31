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
const conversation_1 = __importDefault(require("./conversation"));
const conversation_user_1 = __importDefault(require("./conversation_user"));
const message_1 = __importDefault(require("./message"));
class User extends sequelize_1.Model {
    // Get all conversations from this user where it is admin
    get_own_conversations() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield conversation_1.default.findAll({ where: { admin_id: this.dataValues.id } });
        });
    }
    // Get all conversations from this user
    get_conversations() {
        return __awaiter(this, void 0, void 0, function* () {
            const conversation_users = yield this.get_conversations_user();
            let res = [];
            for (let i = 0; i < conversation_users.length; i++)
                if (conversation_users[i] && conversation_users[i].dataValues.conversation_id) {
                    const conversation = yield conversation_1.default.findByPk(conversation_users[i].dataValues.conversation_id);
                    if (conversation)
                        res.push(conversation);
                }
            return res;
        });
    }
    // Get all conversations user from this user
    get_conversations_user() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield conversation_user_1.default.findAll({ where: { user_id: this.dataValues.id } });
        });
    }
    // Get all messages from this user
    get_messages() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield message_1.default.findAll({ where: { user_id: this.dataValues.id } });
        });
    }
    // Delete this user
    // - Delete all conversations from this user
    // - Delete all conversations user from this user
    // - Delete this user
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            // Delete all conversations from this user
            const conversations = yield this.get_own_conversations();
            for (let i = 0; i < conversations.length; i++)
                yield conversations[i].delete();
            // Delete all conversations user from this user
            const conversation_users = yield this.get_conversations_user();
            for (let i = 0; i < conversation_users.length; i++)
                yield conversation_users[i].delete();
            // Delete this user
            yield this.destroy();
        });
    }
}
User.init({
    id: { type: sequelize_1.DataTypes.BIGINT.UNSIGNED, primaryKey: true, allowNull: false, autoIncrement: true },
    username: { type: sequelize_1.DataTypes.STRING(255), allowNull: false, unique: true },
    password_hash: { type: sequelize_1.DataTypes.STRING(255), allowNull: false },
    permission: { type: sequelize_1.DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
    last_connection: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
    creation_date: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
}, {
    sequelize: client_1.default,
    timestamps: false,
    tableName: process.env.NAME_TABLE_USER_DB,
});
exports.default = User;
//# sourceMappingURL=user.js.map