import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import {
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
  deleteGroup,
} from "./group-chat.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/group", createGroup);
router.put("/group/:id/rename", renameGroup);
router.put("/group/:id/add", addToGroup);
router.put("/group/:id/remove", removeFromGroup);
router.delete("/group/:id", deleteGroup);

export default router;