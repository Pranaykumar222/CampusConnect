import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (token) => {
  if (!token) return null;

  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: {
      token: token.replace("Bearer ", "")
    },
    transports: ["websocket"]
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
