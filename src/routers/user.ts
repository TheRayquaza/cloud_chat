/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/UserNotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - User
 *     payload:
 *       description: User data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserData'
 *     responses:
 *       200:
 *         description: The newly created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 * /api/user/{id}:
 *    get:
 *      summary: Get a user by ID
 *      tags:
 *        - User
 *      parameters:
 *        $ref : '#/components/parameters/IdParam'
 *      responses:
 *        200:
 *          description: The user with the specified ID
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *        404:
 *          $ref: '#/components/responses/UserNotFoundError'
 *        500:
 *          $ref: '#/components/responses/InternalServerError'
 *    delete:
 *      summary: Delete a user by ID
 *      tags:
 *        - User
 *      parameters:
 *        $ref : '#/components/parameters/IdParam'
 *      responses:
 *        204:
 *          description: User deleted successfully
 *        401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *        404:
 *          $ref: '#/components/responses/UserNotFoundError'
 *        500:
 *          $ref: '#/components/responses/InternalServerError'
 */

import express from "express";
import { Router } from "express";
import controller from "../controllers/user";
import middleware_perm from "../middlewares/user_perm";

const router: Router = express.Router();

router.use(middleware_perm);

router.get("/", controller.get_all_user);
router.post("/", controller.post_user);

router.get("/:id", controller.get_user);
router.delete("/:id", controller.delete_user);

export default router;
