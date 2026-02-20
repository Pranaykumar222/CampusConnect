import Message from "./message.model.js";
import Chat from "./chat.model.js";

export const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;

  if (!chatId || !content) {
    return res.status(400).json({ message: "chatId and content required" });
  }

  const message = await Message.create({
    sender: req.user._id,
    chat: chatId,
    content,
    readBy: [req.user._id]
  });

  await Chat.findByIdAndUpdate(chatId, {
    lastMessage: message._id,
    $set: { updatedAt: new Date() }
  });
  

  const fullMessage = await Message.findById(message._id)
    .populate("sender", "firstName lastName email");

  res.status(201).json(fullMessage);
};


export const getMessages = async (req, res) => {
  const { chatId } = req.params;

  const messages = await Message.find({ chat: chatId })
    .populate("sender", "firstName lastName email")
    .sort({ createdAt: 1 });

  res.json(messages);
};
