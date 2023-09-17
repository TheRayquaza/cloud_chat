import express from "express";
import { Router } from "express";
import { login } from "../controllers/login";

const router: Router = express.Router();

router.post("/", login);

export default router;