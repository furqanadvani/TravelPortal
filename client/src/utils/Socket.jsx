// src/utils/socket.js
import { io } from "socket.io-client";
import { TOKEN } from "./Constants";
import { SOCKET_URL } from "./Interceptor";

let socket = null;

export const connectSocket = () => {
  const token = localStorage.getItem(TOKEN);

  if (!token) {
    console.warn("connectSocket: no token found in localStorage — skipping.");
    return null;
  }

  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;