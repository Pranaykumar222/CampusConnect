import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["question", "discussion", "announcement", "help"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    tags: [String],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    saves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],

    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);

