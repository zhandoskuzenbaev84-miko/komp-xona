import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const s = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    s.on('connect', () => {
      console.log('⚡ Socket connected to CyberClub server');
      setIsConnected(true);
    });

    s.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setIsConnected(false);
    });

    s.on('station:reserved', (data) => {
      const codes = data.stationCodes?.join(', ') || 'Station';
      addToast(`🔒 ${codes} band qilindi (Kod: ${data.bookingCode})`, 'warning');
    });

    s.on('station:released', (data) => {
      addToast(`🟢 Joy boʻshadi va yana buyurtma uchun tayyor!`, 'success');
    });

    s.on('station:status_updated', (data) => {
      addToast(`🔄 ${data.stationCode} holati yangilandi: ${data.status}`, 'info');
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, toasts, addToast, removeToast }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return ctx;
};
