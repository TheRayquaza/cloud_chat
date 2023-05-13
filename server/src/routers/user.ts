import { Router } from "express";
import {get_all_user, post_user, get_user, delete_user, put_user} from "../controllers/user";
import { user_perm } from "../middlewares/user_perm";

const router: Router = Router();

router.use(user_perm)

router.get("/", get_all_user);
router.post("/", post_user);
router.post("/", post_user)

router.get("/:id", get_user);
router.delete("/:id", delete_user);
router.put("/:id", put_user);

export default router;
