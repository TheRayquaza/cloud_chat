"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const conversation_1 = require("../controllers/conversation");
router.delete("/:id/leave", conversation_1.leave_conversation);
router.get("/:id/message", conversation_1.get_conversation_messages);
router.get("/:id/user", conversation_1.get_conversation_users);
router.delete("/:id", conversation_1.delete_conversation);
router.get("/:id", conversation_1.get_conversation);
router.put("/:id", conversation_1.modify_conversation);
router.post("/", conversation_1.new_conversation);
exports.default = router;
//# sourceMappingURL=conversation.js.map