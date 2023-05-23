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
import { new_message, get_message, modify_message, delete_message, get_all_message} from "../controllers/message";

const router: Router = express.Router();

router.post("/", new_message);
router.get("/", get_all_message);
router.delete("/", delete_message)

router.delete("/:id", delete_message);
router.get("/:id", get_message);
router.put("/:id", modify_message);

export default router;
