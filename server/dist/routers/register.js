"use strict";
/**
 * @swagger
 * /api/register:
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
 *         description: Redirect to the chat page
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         description: Username or password did not meet expectations
 *       409:
 *         description: User already exists
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const register_1 = require("../controllers/register");
const router = express_1.default.Router();
router.post("/", register_1.register);
exports.default = router;
//# sourceMappingURL=register.js.map