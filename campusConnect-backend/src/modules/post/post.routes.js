import express from "express";
import {
  createPost,
  getPosts,
  getPost,
  deletePost,
  likePost,
  savePost,
  addComment,
  likeComment,
  deleteComment,
  editComment
} from "../post/post.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js"; 

const router = express.Router();

router.post("/posts", authMiddleware, createPost);

router.get("/posts", authMiddleware, getPosts);

router.get("/posts/:postId", authMiddleware, getPost);

router.delete("/posts/:postId", authMiddleware, deletePost);

router.put("/posts/:postId/like", authMiddleware, likePost);

router.put("/posts/:postId/save", authMiddleware, savePost);

router.post("/posts/:postId/comments", authMiddleware, addComment);

router.put("/comments/:commentId/like", authMiddleware, likeComment);

router.delete("/comments/:commentId",authMiddleware,deleteComment);

router.put("/comments/:commentId",authMiddleware,editComment);

export default router;
