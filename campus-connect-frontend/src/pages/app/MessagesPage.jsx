import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import client from "../../services/api/client";
import { connectSocket } from "../../services/socket";
import Avatar from "../../components/ui/Avatar";
import {
  HiOutlinePaperAirplane,
  HiOutlineSearch,
} from "react-icons/hi";

export default function MessagesPage() {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("accessToken");

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [typingUser, setTypingUser] = useState(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);


  const fetchChats = async () => {
    const res = await client.get("/chats");
    const directChats = res.data.filter((c) => c.type === "direct");
    setChats(directChats);
  };

  useEffect(() => {
    fetchChats();
  }, []);


  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(token);
    socketRef.current = socket;

    socket.on("newMessage", (msg) => {
      const chatId =
        typeof msg.chat === "object" ? msg.chat._id : msg.chat;

      setChats((prev) =>
        prev.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                lastMessage: msg,
                unreadCount:
                  chatId === activeChatId
                    ? 0
                    : (chat.unreadCount || 0) + 1,
              }
            : chat
        )
      );

      if (chatId === activeChatId) {
        setMessages((prev) => [...prev, msg]);
        socket.emit("markSeen", { chatId });
      }
    });

    socket.on("typing", ({ name, chatId }) => {
      if (chatId === activeChatId) {
        setTypingUser(name);
      }
    });

    socket.on("stopTyping", ({ chatId }) => {
      if (chatId === activeChatId) {
        setTypingUser(null);
      }
    });

    socket.on("updateUnreadCount", ({ chatId, unreadCount }) => {
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === chatId
            ? { ...chat, unreadCount }
            : chat
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [token, activeChatId]);


  useEffect(() => {
    if (!activeChatId) return;

    const loadMessages = async () => {
      const res = await client.get(`/messages/${activeChatId}`);
      setMessages(res.data);

      socketRef.current?.emit("joinChat", activeChatId);
      socketRef.current?.emit("markSeen", { chatId: activeChatId });

      setChats((prev) =>
        prev.map((c) =>
          c._id === activeChatId
            ? { ...c, unreadCount: 0 }
            : c
        )
      );
    };

    loadMessages();
  }, [activeChatId]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);


  const handleSend = () => {
    if (!input.trim() || !activeChatId) return;

    socketRef.current.emit("sendMessage", {
      chatId: activeChatId,
      content: input.trim(),
    });

    setInput("");
    socketRef.current.emit("stopTyping", {
      chatId: activeChatId,
    });
  };

  const handleTyping = () => {
    if (!activeChatId) return;
    socketRef.current.emit("typing", {
      chatId: activeChatId,
    });
  };


  const filteredChats = chats.filter((chat) => {
    const other = chat.participants.find(
      (p) => p._id !== user._id
    );
    const name = `${other?.firstName} ${other?.lastName}`;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const getChatName = (chat) => {
    const other = chat.participants.find(
      (p) => p._id !== user._id
    );
    return `${other?.firstName} ${other?.lastName}`;
  };


  return (
    <div className="flex h-[calc(100vh-7rem)] max-w-6xl mx-auto border rounded-xl overflow-hidden bg-white">

      
      <div className="w-80 border-r flex flex-col">

        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Messages</h2>

          <div className="mt-3 flex items-center gap-2 border rounded-lg px-3 py-2">
            <HiOutlineSearch className="h-4 w-4 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full text-sm outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <button
              key={chat._id}
              onClick={() => setActiveChatId(chat._id)}
              className={`flex w-full items-center gap-3 px-4 py-3 hover:bg-neutral-100 ${
                activeChatId === chat._id ? "bg-sky-50" : ""
              }`}
            >
              <Avatar name={getChatName(chat)} size="md" />

              <div className="flex-1 text-left">
                <p className="text-sm font-medium">
                  {getChatName(chat)}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {chat.lastMessage?.content || "Start chat"}
                </p>
              </div>

              {chat.unreadCount > 0 && (
                <span className="bg-sky-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {chat.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">

        {activeChatId ? (
          <>
            <div className="p-4 border-b">
              <p className="font-medium">
                {getChatName(
                  chats.find((c) => c._id === activeChatId)
                )}
              </p>
              <p className="text-xs text-neutral-500">
                {typingUser || "Online"}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.sender._id === user._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs rounded-2xl px-4 py-2 ${
                      msg.sender._id === user._id
                        ? "bg-sky-600 text-white"
                        : "bg-neutral-100"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-4 flex gap-2">
              <input
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  handleTyping();
                }}
                placeholder="Type a message..."
                className="flex-1 border rounded-xl px-4 py-2 text-sm"
              />
              <button
                onClick={handleSend}
                className="bg-sky-600 text-white p-2 rounded-xl"
              >
                <HiOutlinePaperAirplane className="h-5 w-5 rotate-90" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-neutral-400">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}
