"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Routes
const login_1 = __importDefault(require("./login"));
const register_1 = __importDefault(require("./register"));
const user_1 = __importDefault(require("./user"));
const conversation_1 = __importDefault(require("./conversation"));
const message_1 = __importDefault(require("./message"));
// Middlewares
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Body parser
router.use(express_1.default.json());
router.use(express_1.default.urlencoded({ extended: true }));
// API
router.use("/login", login_1.default);
router.use("/register", register_1.default);
router.use("/user", auth_1.auth, user_1.default);
router.use("/conversation", auth_1.auth, conversation_1.default);
router.use("/message", auth_1.auth, message_1.default);
exports.default = router;
//# sourceMappingURL=api.js.map