import express from "express";
import { Router } from "express";
import { new_message, get_message, modify_message, delete_message} from "../controllers/message";

const router: Router = express.Router();

router.post("/", new_message);

router.delete("/:id", delete_message);
router.get("/:id", get_message);
router.put("/:id", modify_message);

export default router;
