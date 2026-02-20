import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./modules/user/user.model.js";
import Message from "./modules/messaging/message.model.js";
import Chat from "./modules/messaging/chat.model.js";
import Notification from "./modules/notification/notification.model.js";

let io;
const onlineUsers = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No token"));

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.id).select("_id firstName");

      if (!user) return next(new Error("User not found"));

      socket.user = user;
      onlineUsers.set(user._id.toString(), socket.id);

      next();
    } catch {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.user._id.toString();
    socket.join(userId);

    await User.findByIdAndUpdate(socket.user._id, {
      isOnline: true,
      lastSeen: null,
    });

    const userChats = await Chat.find({
      participants: socket.user._id,
    }).select("_id");

    userChats.forEach((chat) => {
      socket.join(chat._id.toString());
    });

    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
    });

    socket.on("typing", ({ chatId }) => {
      socket.to(chatId).emit("typing", {
        userId: socket.user._id,
        name: socket.user.firstName,
        chatId,
      });
    });

    socket.on("stopTyping", ({ chatId }) => {
      socket.to(chatId).emit("stopTyping", { chatId });
    });

    socket.on("sendMessage", async ({ chatId, content }) => {
      if (!chatId || !content) return;

      const message = await Message.create({
        sender: socket.user._id,
        chat: chatId,
        content,
        readBy: [socket.user._id],
      });

      await message.populate("sender", "firstName lastName");
      await message.populate("chat");

      await Chat.findByIdAndUpdate(chatId, {
        lastMessage: message._id,
        $set: { updatedAt: new Date() },
      });

      io.to(chatId).emit("newMessage", message);

      const chat = await Chat.findById(chatId).select("participants");

      for (let participantId of chat.participants) {
        const participantIdStr = participantId.toString();
        const senderIdStr = socket.user._id.toString();

        if (participantIdStr === senderIdStr) continue;

        const unreadCount = await Message.countDocuments({
          chat: chatId,
          sender: { $ne: participantId },
          readBy: { $ne: participantId },
        });

        const socketId = onlineUsers.get(participantIdStr);

        if (socketId) {
          io.to(socketId).emit("updateUnreadCount", {
            chatId,
            unreadCount,
          });
        }

        const notification = await Notification.create({
          recipient: participantId,
          sender: socket.user._id,
          type: "new_message",
          entityId: chatId,
          message: `${socket.user.firstName} sent you a message`,
        });

        await notification.populate("sender", "firstName lastName");

        io.to(participantIdStr).emit("newNotification", notification);
      }
    });

    socket.on("markSeen", async ({ chatId }) => {
      const userId = socket.user._id;

      await Message.updateMany(
        {
          chat: chatId,
          sender: { $ne: userId },
          readBy: { $ne: userId },
        },
        { $addToSet: { readBy: userId } }
      );

      socket.to(chatId).emit("messagesSeen", {
        chatId,
        seenBy: userId,
      });
    });

    socket.on("disconnect", async () => {
      onlineUsers.delete(socket.user._id.toString());

      await User.findByIdAndUpdate(socket.user._id, {
        isOnline: false,
        lastSeen: new Date(),
      });
    });
  });
};

export const getIO = () => io;
