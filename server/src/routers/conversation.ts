import express from "express";
const router = express.Router();

import {
    new_conversation,
    get_conversation,
    modify_conversation,
    delete_conversation,
    get_conversation_messages,
    get_conversation_users,
    leave_conversation
} from "../controllers/conversation";

router.delete("/:id/leave", leave_conversation);

router.get("/:id/message", get_conversation_messages);
router.get("/:id/user", get_conversation_users);

router.delete("/:id", delete_conversation);
router.get("/:id", get_conversation);
router.put("/:id", modify_conversation);

router.post("/", new_conversation);

export default router;