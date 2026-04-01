import { useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const useSocket = () => {
    const { token, user } = useAuthStore();
    const socketRef = useRef(null);

    useEffect(() => {
        if (!token) return;

        // Initialize socket connection
        const socket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket']
        });

        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message);
        });

        socketRef.current = socket;

        return () => {
            if (socket) socket.disconnect();
        };
    }, [token]);

    const emit = useCallback((event, data) => {
        if (socketRef.current) {
            socketRef.current.emit(event, data);
        }
    }, []);

    const on = useCallback((event, callback) => {
        if (socketRef.current) {
            socketRef.current.on(event, callback);
        }
    }, []);

    const off = useCallback((event, callback) => {
        if (socketRef.current) {
            socketRef.current.off(event, callback);
        }
    }, []);

    return { socket: socketRef.current, emit, on, off };
};

export default useSocket;
