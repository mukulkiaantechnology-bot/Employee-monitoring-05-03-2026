import React, { createContext, useContext, useCallback } from 'react';
import { useNotificationStore } from '../store/notificationStore';
import ToastContainer from '../components/common/ToastContainer';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const addNotification = useNotificationStore((state) => state.addNotification);

    const toast = {
        success: (msg) => addNotification(msg, 'success'),
        error: (msg) => addNotification(msg, 'error'),
        warning: (msg) => addNotification(msg, 'warning'),
        info: (msg) => addNotification(msg, 'info'),
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
