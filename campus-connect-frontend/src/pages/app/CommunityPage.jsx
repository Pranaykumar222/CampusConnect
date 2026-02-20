import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import client from "../../services/api/client";
import { connectSocket } from "../../services/socket";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import Tabs from "../../components/ui/Tabs";
import Modal from "../../components/ui/Modal";
import TextArea from "../../components/ui/TextArea";
import Select from "../../components/ui/Select";

import {
  HiOutlineThumbUp,
  HiThumbUp,
  HiOutlineBookmark,
  HiBookmark,
  HiOutlineShare,
  HiOutlinePlus,
} from "react-icons/hi";

const TABS = ["Feed", "My Posts", "Saved"];

export default function CommunityPage() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("Feed");
  const [createOpen, setCreateOpen] = useState(false);

  const [newPost, setNewPost] = useState({
    category: "discussion",
    content: "",
  });

  const socketRef = useRef(null);


  useEffect(() => {
    if (!token) return;

    socketRef.current = connectSocket(token);

    socketRef.current.on("newPost", (post) => {
      setPosts((prev) => {
        if (prev.find((p) => p._id === post._id)) return prev;
        return [post, ...prev];
      });
    });

    return () => socketRef.current?.disconnect();
  }, [token]);


  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await client.get(`/community/posts?page=1&limit=20`);
    setPosts(res.data.posts);
  };


  const handleCreatePost = async () => {
    if (!newPost.content.trim()) return;

    await client.post("/community/posts", newPost);

    setNewPost({ category: "discussion", content: "" });
    setCreateOpen(false);
  };


  const handleLike = async (postId) => {
    await client.put(`/community/posts/${postId}/like`);

    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? {
              ...p,
              likes: p.likes.includes(user._id)
                ? p.likes.filter((id) => id !== user._id)
                : [...p.likes, user._id],
            }
          : p
      )
    );
  };


  const handleSave = async (postId) => {
    await client.put(`/community/posts/${postId}/save`);

    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? {
              ...p,
              saves: p.saves.includes(user._id)
                ? p.saves.filter((id) => id !== user._id)
                : [...p.saves, user._id],
            }
          : p
      )
    );
  };


  const handleShare = (postId) => {
    const url = `${window.location.origin}/community/${postId}`;
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };


  const filteredPosts =
    activeTab === "My Posts"
      ? posts.filter((p) => p.author._id === user._id)
      : activeTab === "Saved"
      ? posts.filter((p) => p.saves.includes(user._id))
      : posts;

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = { d: 86400, h: 3600, m: 60 };

    for (let key in intervals) {
      const interval = Math.floor(seconds / intervals[key]);
      if (interval >= 1) return `${interval}${key} ago`;
    }
    return "Just now";
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">

      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Community</h1>

        <Button onClick={() => setCreateOpen(true)}>
          <HiOutlinePlus className="mr-1 h-4 w-4" />
          New Post
        </Button>
      </div>

      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      
      {filteredPosts.map((post) => {
        const liked = post.likes.includes(user._id);
        const saved = post.saves.includes(user._id);

        return (
          <motion.div key={post._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card
              className="p-5 cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/community/${post._id}`)}
            >
              <div className="flex gap-3">
                <Avatar
                  name={`${post.author.firstName} ${post.author.lastName}`}
                  size="md"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {post.author.firstName} {post.author.lastName}
                    </span>

                    <span className="text-xs text-neutral-400">
                      {timeAgo(post.createdAt)}
                    </span>

                    <Badge className="ml-auto">
                      {post.category}
                    </Badge>
                  </div>

                  <p className="mt-3 text-sm line-clamp-3">
                    {post.content}
                  </p>

                  <div
                    className="mt-4 flex items-center gap-6 border-t pt-3 text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex gap-1 items-center ${
                        liked ? "text-sky-600" : ""
                      }`}
                    >
                      {liked ? <HiThumbUp /> : <HiOutlineThumbUp />}
                      {post.likes.length}
                    </button>

                    <button
                      onClick={() => handleSave(post._id)}
                      className={saved ? "text-sky-600" : ""}
                    >
                      {saved ? <HiBookmark /> : <HiOutlineBookmark />}
                    </button>

                    <button onClick={() => handleShare(post._id)}>
                      <HiOutlineShare />
                    </button>

                    <span className="ml-auto text-xs text-neutral-400">
                      {post.comments.length} comments
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}

      
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Post"
      >
        <div className="space-y-4">

          <Select
            label="Category"
            value={newPost.category}
            onChange={(e) =>
              setNewPost({ ...newPost, category: e.target.value })
            }
            options={[
              { value: "question", label: "Question" },
              { value: "discussion", label: "Discussion" },
              { value: "announcement", label: "Announcement" },
              { value: "help", label: "Help" },
            ]}
          />

          <TextArea
            rows={4}
            value={newPost.content}
            onChange={(e) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
            placeholder="What's on your mind?"
          />

          <div className="flex justify-end">
            <Button onClick={handleCreatePost}>
              Post
            </Button>
          </div>

        </div>
      </Modal>

    </div>
  );
}


