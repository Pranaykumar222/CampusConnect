import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import client from "../../services/api/client";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import TextArea from "../../components/ui/TextArea";

import {
  HiOutlineThumbUp,
  HiThumbUp,
  HiOutlineBookmark,
  HiBookmark,
  HiOutlineShare,
  HiOutlineTrash,
  HiOutlinePencil,
} from "react-icons/hi";

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");


  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    const viewed = sessionStorage.getItem("viewed-" + postId);

    const res = await client.get(
      `/community/posts/${postId}?skipView=${viewed === "true"}`
    );

    if (!viewed) {
      sessionStorage.setItem("viewed-" + postId, "true");
    }

    setPost(res.data.post);
  };


  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = { d: 86400, h: 3600, m: 60 };

    for (let key in intervals) {
      const interval = Math.floor(seconds / intervals[key]);
      if (interval >= 1) return `${interval}${key} ago`;
    }
    return "Just now";
  };


  const handleLikePost = async () => {
    await client.put(`/community/posts/${postId}/like`);

    setPost((prev) => ({
      ...prev,
      likes: prev.likes.includes(user._id)
        ? prev.likes.filter((id) => id !== user._id)
        : [...prev.likes, user._id],
    }));
  };

  const handleSavePost = async () => {
    await client.put(`/community/posts/${postId}/save`);

    setPost((prev) => ({
      ...prev,
      saves: prev.saves.includes(user._id)
        ? prev.saves.filter((id) => id !== user._id)
        : [...prev.saves, user._id],
    }));
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Delete this post?")) return;

    await client.delete(`/community/posts/${postId}`);
    navigate("/community");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
  };


  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    const res = await client.post(
      `/community/posts/${postId}/comments`,
      { content: commentText }
    );

    setPost((prev) => ({
      ...prev,
      comments: [...prev.comments, res.data.comment],
    }));

    setCommentText("");
  };

  const handleLikeComment = async (commentId) => {
    await client.put(`/community/comments/${commentId}/like`);

    setPost((prev) => ({
      ...prev,
      comments: prev.comments.map((c) =>
        c._id === commentId
          ? {
              ...c,
              likes: c.likes.includes(user._id)
                ? c.likes.filter((id) => id !== user._id)
                : [...c.likes, user._id],
            }
          : c
      ),
    }));
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    await client.delete(`/community/comments/${commentId}`);

    setPost((prev) => ({
      ...prev,
      comments: prev.comments.filter((c) => c._id !== commentId),
    }));
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    const res = await client.put(
      `/community/comments/${commentId}`,
      { content: editText }
    );

    setPost((prev) => ({
      ...prev,
      comments: prev.comments.map((c) =>
        c._id === commentId ? res.data.comment : c
      ),
    }));

    setEditingCommentId(null);
    setEditText("");
  };

  if (!post) return null;

  const liked = post.likes.includes(user._id);
  const saved = post.saves.includes(user._id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">


      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="p-6 shadow-lg">

          <div className="flex gap-4">

            <Avatar
              name={`${post.author.firstName} ${post.author.lastName}`}
              size="lg"
            />

            <div className="flex-1">

              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">
                  {post.author.firstName} {post.author.lastName}
                </span>

                <span className="text-xs text-neutral-400">
                  {timeAgo(post.createdAt)}
                </span>

                <Badge className="ml-auto">
                  {post.category}
                </Badge>
              </div>

              <p className="mt-4 text-base leading-relaxed">
                {post.content}
              </p>

             
              <div className="mt-6 flex items-center gap-8 border-t pt-4 text-sm">

                <button
                  onClick={handleLikePost}
                  className={`flex gap-1 items-center ${
                    liked ? "text-sky-600" : ""
                  }`}
                >
                  {liked ? <HiThumbUp /> : <HiOutlineThumbUp />}
                  {post.likes.length}
                </button>

                <button
                  onClick={handleSavePost}
                  className={saved ? "text-sky-600" : ""}
                >
                  {saved ? <HiBookmark /> : <HiOutlineBookmark />}
                </button>

                <button onClick={handleShare}>
                  <HiOutlineShare />
                </button>

                {post.author._id === user._id && (
                  <button
                    onClick={handleDeletePost}
                    className="text-red-500"
                  >
                    <HiOutlineTrash />
                  </button>
                )}

                <span className="ml-auto text-xs text-neutral-400">
                  {post.views} views
                </span>
              </div>

            </div>
          </div>
        </Card>
      </motion.div>


      <Card className="p-6 space-y-5">

        <h3 className="text-lg font-semibold">
          Comments ({post.comments.length})
        </h3>

        {post.comments.map((c) => {
          const likedComment = c.likes.includes(user._id);

          return (
            <motion.div
              key={c._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-neutral-100 p-4 rounded-xl space-y-2"
            >
              <div className="flex justify-between">

                <div className="flex-1">
                  <strong>{c.author.firstName}</strong>

                  {editingCommentId === c._id ? (
                    <>
                      <TextArea
                        rows={2}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="mt-2"
                      />

                      <div className="flex gap-2 mt-2">
                        <Button onClick={() => handleEditComment(c._id)}>
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => setEditingCommentId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm mt-1">{c.content}</p>
                  )}
                </div>

                {(c.author._id === user._id ||
                  post.author._id === user._id) && (
                  <div className="flex gap-2">
                    {c.author._id === user._id && (
                      <button
                        onClick={() => {
                          setEditingCommentId(c._id);
                          setEditText(c.content);
                        }}
                      >
                        <HiOutlinePencil />
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteComment(c._id)}
                      className="text-red-500"
                    >
                      <HiOutlineTrash />
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleLikeComment(c._id)}
                className={`flex gap-1 items-center text-sm ${
                  likedComment ? "text-sky-600" : ""
                }`}
              >
                {likedComment ? <HiThumbUp /> : <HiOutlineThumbUp />}
                {c.likes.length}
              </button>
            </motion.div>
          );
        })}

        <div className="pt-4 border-t space-y-3">
          <TextArea
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
          />

          <div className="flex justify-end">
            <Button
              onClick={handleAddComment}
              className="px-8 py-3"
            >
              Post Comment
            </Button>
          </div>
        </div>

      </Card>
    </div>
  );
}

