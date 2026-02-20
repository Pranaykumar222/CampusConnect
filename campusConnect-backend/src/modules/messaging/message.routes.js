import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import {
  sendMessage,
  getMessages
} from "./message.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/:chatId", getMessages);

export default router;
