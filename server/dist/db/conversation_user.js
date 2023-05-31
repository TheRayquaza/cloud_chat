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
class ConversationUser extends sequelize_1.Model {
    // Delete this
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.destroy();
        });
    }
}
ConversationUser.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
            model: process.env.NAME_TABLE_USER_DB,
            key: 'id',
        }
    },
    conversation_id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
            model: process.env.NAME_TABLE_CONVERSATION_DB,
            key: 'id'
        }
    }
}, {
    sequelize: client_1.default,
    tableName: process.env.NAME_TABLE_CONVERSATION_USER_DB,
    timestamps: false
});
exports.default = ConversationUser;
//# sourceMappingURL=conversation_user.js.map