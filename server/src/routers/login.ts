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

import express from "express";
import { Router } from "express";
import { login } from "../controllers/login";

const router: Router = express.Router();

router.post("/", login);

export default router;