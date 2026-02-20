import express from "express";
import {
  dashboardStats,
  getUsers,
  removeUser,
  banUser,
  removePost,
  removeProject,
  removeEvent,
  removeResource,
} from "./admin.controller.js";

import authMiddleware from "../../middleware/authMiddleware.js";
import { adminOnly } from "../../middleware/admin.middleware.js";

const router = express.Router();

router.use(authMiddleware, adminOnly);

router.get("/stats", dashboardStats);

router.get("/users", getUsers);
router.delete("/users/:id", removeUser);
router.patch("/users/:id/ban", banUser);

router.delete("/posts/:id", removePost);
router.delete("/projects/:id", removeProject);
router.delete("/events/:id", removeEvent);
router.delete("/resources/:id", removeResource);

export default router;
