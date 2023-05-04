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

import { Router } from "express";
import { get_all_user, post_user, get_user, delete_user } from "../controllers/user";
import { user_perm } from "../middlewares/user_perm";

const router: Router = Router();

router.use(user_perm)

router.get("/", get_all_user);
router.post("/", post_user);

router.get("/:id", get_user);
router.delete("/:id", delete_user);

export default router;
