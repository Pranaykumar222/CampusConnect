import Post from "./post.model.js";
import Comment from "./comment.model.js";
import User from "../user/user.model.js";
import Notification from "../notification/notification.model.js";
import { getIO } from "../../socket.js";


export const createPost = async (req, res) => {
  try {
    const { title, category, content, tags } = req.body;

    if (!category || !content) {
      return res.status(400).json({
        message: "Category and content required",
      });
    }

    const post = await Post.create({
      author: req.user._id,
      title,
      category,
      content,
      tags,
    });

    const fullPost = await Post.findById(post._id)
      .populate("author", "firstName lastName department")
      .populate({
        path: "comments",
        populate: { path: "author", select: "firstName lastName" },
      });

    const io = getIO();
    io.emit("newPost", fullPost);

    res.status(201).json({ post: fullPost });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



export const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    const posts = await Post.find()
      .populate("author", "firstName lastName department")
      .populate({
        path: "comments",
        populate: { path: "author", select: "firstName lastName" },
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Post.countDocuments();

    res.json({
      posts,
      hasMore: page * limit < total,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { skipView } = req.query;

    let post = await Post.findById(postId)
      .populate("author", "firstName lastName department")
      .populate({
        path: "comments",
        populate: { path: "author", select: "firstName lastName" },
      });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (skipView !== "true") {
      post.views += 1;
      await post.save();
    }

    res.json({ post });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await Comment.deleteMany({ post: postId });
    await post.deleteOne();

    res.json({ message: "Post deleted" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/*
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();

    res.status(200).json({ likes: post.likes.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
*/
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);

      if (post.author.toString() !== userId.toString()) {
        const notification = await Notification.create({
          recipient: post.author,
          sender: userId,
          type: "post_like",
          entityId: post._id,
          message: `${req.user.firstName} liked your post`,
        });
        
        const io = getIO();
        await notification.populate("sender", "firstName lastName");

io.to(post.author.toString()).emit("newNotification", notification);
      
      }
    }

    await post.save();

    res.status(200).json({ likes: post.likes.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const savePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.saves.includes(userId)) {
      post.saves.pull(userId);
    } else {
      post.saves.push(userId);
    }

    await post.save();
    res.status(200).json({ saves: post.saves.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      content,
    });

    post.comments.push(comment._id);
    await post.save();

    await comment.populate("author", "firstName lastName");


    const io = getIO();

    io.emit("newComment", {
      postId,
      comment,
    });


    if (post.author.toString() !== req.user._id.toString()) {
      const notification = await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: "post_comment",
        entityId: post._id,
        message: `${req.user.firstName} commented on your post`,
      });

      await notification.populate("sender", "firstName lastName");

      io.to(post.author.toString()).emit("newNotification", notification);
    }

    res.status(201).json({ comment });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};







// ---------------- LIKE / UNLIKE COMMENT ----------------
export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.likes.includes(userId)) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();
    res.status(200).json({ likes: comment.likes.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// ---------------- DELETE COMMENT ----------------
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const post = await Post.findById(comment.post);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // allow comment author OR post author
    if (
      comment.author.toString() !== userId.toString() &&
      post.author.toString() !== userId.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // remove comment reference from post
    post.comments.pull(commentId);
    await post.save();

    await comment.deleteOne();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// ---------------- EDIT COMMENT ----------------
export const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.content = content;
    await comment.save();

    await comment.populate("author", "firstName lastName");

    res.status(200).json({ comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
