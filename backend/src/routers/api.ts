import express, {NextFunction} from "express";
// Routes
import login_route from "./login";
import register_route from "./register";
import user_route from "./user";
import conversation_route from "./conversation";
import message_route from "./message";
// Middlewares
import { auth } from "../middlewares/auth";

const router = express.Router();

// Body parser
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// API
router.use("/login", login_route);
router.use("/register", register_route);
router.use("/user", auth, user_route);
router.use("/conversation", auth, conversation_route);
router.use("/message", auth, message_route);

export default router;