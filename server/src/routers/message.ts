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
import express from "express";
import { Router } from "express";
import * as controller from "../controllers/message";

const router: Router = express.Router();

router.post("/", controller.new_message);
router.delete("/:id", controller.delete_message);
router.get("/:id", controller.get_message);
router.put("/:id", controller.modify_message);

export default router;
