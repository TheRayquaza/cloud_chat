"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const user_perm_1 = require("../middlewares/user_perm");
const router = (0, express_1.Router)();
router.get("/:id/conversation", user_1.get_user_conversations);
router.get("/:id", user_1.get_user);
router.delete("/:id", user_perm_1.user_perm, user_1.delete_user);
router.put("/:id", user_perm_1.user_perm, user_1.put_user);
router.get("/", user_1.get_all_user);
router.post("/", user_1.post_user);
exports.default = router;
//# sourceMappingURL=user.js.map