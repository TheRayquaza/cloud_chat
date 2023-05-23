import express from "express";
const router = express.Router();

import { new_conversation, get_conversation, modify_conversation, delete_conversation} from "../controllers/conversation";

router.post("/", new_conversation);
router.delete("/:id", delete_conversation);
router.get("/:id", get_conversation);
router.put("/:id", modify_conversation);

export default router;