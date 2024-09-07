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


import express from "express";
import { register } from "../controllers/register";

const router = express.Router();

router.post("/", register);

export default router;