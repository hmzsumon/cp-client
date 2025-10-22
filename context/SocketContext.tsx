"use client";

import socketUrl from "@/config/socketUrl"; // ✅ Use dedicated socket URL
import { apiSlice } from "@/redux/features/api/apiSlice";
import { SocketUser } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

interface iSocketContextType {
  socket: Socket | null;
  isSocketConnected: boolean;
  onlineUsers: SocketUser[]; // Optional
}

export const SocketContext = createContext<iSocketContextType | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  /* ──────────  auth + local states  ────────── */
  const { user } = useSelector((state: any) => state.auth);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<SocketUser[]>([]);
  const dispatch = useDispatch();

  /* ──────────  connect + join room  ────────── */
  useEffect(() => {
    if (!user || !user._id) return;

    const newSocket = io(socketUrl, {
      transports: ["websocket"],
      // auth: { token: user.accessToken }, // optional: secure with token
    });

    newSocket.on("connect", () => {
      newSocket.emit("join-room", user._id);
      setSocket(newSocket);
      setIsSocketConnected(true);
    });

    newSocket.on("disconnect", () => {
      setIsSocketConnected(false);
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setIsSocketConnected(false);
    };
  }, [user?._id]);

  /* ──────────  runtime socket listeners  ────────── */
  useEffect(() => {
    if (!socket) return;

    const onUsers = (users: SocketUser[]) => setOnlineUsers(users);
    const onNewNotif = () => {
      dispatch(
        apiSlice.util.invalidateTags([
          "MyUnreadNotifications",
          "MyUnreadNotificationsCount",
        ])
      );
    };
    const onCount = () => {
      dispatch(apiSlice.util.invalidateTags(["MyUnreadNotificationsCount"]));
    };

    socket.on("getUsers", onUsers);
    socket.on("notifications:new", onNewNotif);
    socket.on("notifications:count", onCount);

    return () => {
      socket.off("getUsers", onUsers);
      socket.off("notifications:new", onNewNotif);
      socket.off("notifications:count", onCount);
    };
  }, [socket, dispatch]);

  /* ──────────  provider  ────────── */
  return (
    <SocketContext.Provider value={{ socket, isSocketConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx)
    throw new Error("useSocket must be used within a SocketContextProvider");
  return ctx;
};
