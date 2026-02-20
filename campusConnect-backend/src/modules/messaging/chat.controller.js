import Chat from "./chat.model.js";
import Message from "./message.model.js";

export const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  let chat = await Chat.findOne({
    type: "direct",
    participants: { $all: [req.user._id, userId] },
  })
    .populate("participants", "-password")
    .populate({
      path: "lastMessage",
      populate: { path: "sender", select: "firstName lastName" }
    });

  if (chat) return res.json(chat);

  const newChat = await Chat.create({
    type: "direct",
    participants: [req.user._id, userId],
  });

  const fullChat = await Chat.findById(newChat._id)
    .populate("participants", "-password");

  res.status(201).json(fullChat);
};



export const fetchChats = async (req, res) => {
  const chats = await Chat.find({
    participants: req.user._id
  })
    .populate("participants", "-password")
    .populate("admin", "-password")
    .populate("project", "title")
    .populate({
      path: "lastMessage",
      populate: { path: "sender", select: "firstName lastName" }
    })
    .sort({ updatedAt: -1 });

  const chatsWithUnread = await Promise.all(
    chats.map(async (chat) => {
      const unreadCount = await Message.countDocuments({
        chat: chat._id,
        sender: { $ne: req.user._id },
        readBy: { $ne: req.user._id }
      });

      return {
        ...chat.toObject(),
        unreadCount
      };
    })
  );

  res.json(chatsWithUnread);
};
