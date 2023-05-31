"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @swagger
 * /api/message:
 *   post:
 *     tags:
 *       - Register
 *     summary: Register a new user
 *     payload:
 *       description: User data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserData'
 *     responses:
 *       200:
 *         description: Default response
 */
const express_1 = __importDefault(require("express"));
const message_1 = require("../controllers/message");
const router = express_1.default.Router();
router.post("/", message_1.new_message);
router.delete("/:id", message_1.delete_message);
router.get("/:id", message_1.get_message);
router.put("/:id", message_1.modify_message);
exports.default = router;
//# sourceMappingURL=message.js.map