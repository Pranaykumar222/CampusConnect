import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowStats,
  getRelationshipStatus
} from "../user/follow.controller.js";

const router = express.Router();

router.post("/:userId", authMiddleware, followUser);
router.delete("/:userId", authMiddleware, unfollowUser);

router.get("/:userId/relationship", authMiddleware, getRelationshipStatus);

router.get("/:userId/followers", authMiddleware, getFollowers);
router.get("/:userId/following", authMiddleware, getFollowing);

router.get("/:userId/stats", authMiddleware, getFollowStats);

export default router;

