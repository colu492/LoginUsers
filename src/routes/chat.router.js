import { Router } from "express";
import { getChatMessages } from "../controllers/chat.controller.js";

const router = Router();

router.get("/", getChatMessages);

export default router;
