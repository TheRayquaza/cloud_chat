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
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

import express from "express";
import { Router } from "express";
import { Request, Response } from "express";
import loginController from "../controllers/login";

const router: Router = express.Router();

router.post("/", (req: Request, res: Response) => {
    loginController.login(req, res);
});

export default router;