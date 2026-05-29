'use client';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

function getWsUrl() {
  if (typeof window === 'undefined') return 'http://localhost:4000';
  return `${window.location.protocol}//${window.location.hostname}:4000`;
}

export function useSocket() {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (!token) return;

    const socket = io(`${getWsUrl()}/submissions`, {
      auth: { token },
      transports: ['websocket']
    });

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return { socket: socketRef.current, isConnected };
}
