import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  getUsers,
  getUserById,
  updatePrivacy,
  getProfileStats,
  uploadAvatar,
  uploadBanner,
  changePassword,
  deleteAccount
} from "../user/user.controller.js";

import { getRelationshipStatus } from "../user/follow.controller.js";
import { upload } from "../../middleware/upload.middleware.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();


router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, updateMyProfile);
router.patch("/privacy", authMiddleware, updatePrivacy);


router.post(
  "/avatar",
  authMiddleware,
  upload.single("image"),
  uploadAvatar
);

router.post(
  "/banner",
  authMiddleware,
  upload.single("image"),
  uploadBanner
);


router.get("/", authMiddleware, getUsers);


router.get(
  "/:userId/relationship",
  authMiddleware,
  getRelationshipStatus
);


router.get(
  "/:id/stats",
  authMiddleware,
  getProfileStats
);


router.get(
  "/:id",
  authMiddleware,
  getUserById
);

router.put("/change-password", authMiddleware, changePassword);
router.delete("/delete-account", authMiddleware, deleteAccount);


export default router;
