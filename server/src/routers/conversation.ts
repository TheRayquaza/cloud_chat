/**
 * @swagger
 * /api/conversation:
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


import express from "express";
const router = express.Router();

import * as controller from "../controllers/conversation";

router.post("/", controller.new_conversation);
router.delete("/:id", controller.delete_conversation);
router.get("/:id", controller.get_conversation);
router.put("/:id", controller.modify_conversation);

export default router;