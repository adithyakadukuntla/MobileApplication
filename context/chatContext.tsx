import React, { createContext, useContext } from "react";
import { io, Socket } from "socket.io-client";
import { API_URL } from "@/constants/environement";

export const socket: Socket = io(API_URL);

export const SocketContext = createContext(socket);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
