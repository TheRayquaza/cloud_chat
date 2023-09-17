import { Router } from "express";
import {get_my_user, post_user, get_user, delete_user, put_user, get_my_conversations, delete_my_user} from "../controllers/user";
import { user_perm } from "../middlewares/user_perm";

const router: Router = Router();

router.get("/conversation", get_my_conversations);

router.get("/:id", get_user); // TODO : add check friendship
router.delete("/:id", user_perm, delete_user);
router.put("/:id", user_perm, put_user);

router.get("/", get_my_user);
router.post("/", post_user);
router.delete("/", delete_my_user);


export default router;
