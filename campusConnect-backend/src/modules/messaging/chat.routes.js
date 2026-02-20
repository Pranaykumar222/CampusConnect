import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import { accessChat, fetchChats } from "./chat.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", accessChat);
router.get("/", fetchChats);

export default router;
