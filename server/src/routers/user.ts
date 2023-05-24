import { Router } from "express";
import {get_all_user, post_user, get_user, delete_user, put_user, get_user_conversations} from "../controllers/user";
import { user_perm } from "../middlewares/user_perm";

const router: Router = Router();

router.get("/:id/conversation", get_user_conversations);

router.use(user_perm)

router.get("/:id", get_user);
router.delete("/:id", delete_user);
router.put("/:id", put_user);

router.get("/", get_all_user);
router.post("/", post_user);
router.post("/", post_user)



export default router;
