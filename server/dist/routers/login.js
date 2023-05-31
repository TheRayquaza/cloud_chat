"use strict";
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Logs a user in
 *     tags:
 *       - Login
 *     payload:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserData'
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserData'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
    *      $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const login_1 = require("../controllers/login");
const router = express_1.default.Router();
router.post("/", login_1.login);
exports.default = router;
//# sourceMappingURL=login.js.map