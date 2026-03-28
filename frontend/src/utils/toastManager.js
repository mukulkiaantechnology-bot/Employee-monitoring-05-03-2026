import { useNotificationStore } from '../store/notificationStore';

export const toast = {
    success: (message) => useNotificationStore.getState().addNotification(message, 'success'),
    error: (message) => useNotificationStore.getState().addNotification(message, 'error'),
    warning: (message) => useNotificationStore.getState().addNotification(message, 'warning'),
    info: (message) => useNotificationStore.getState().addNotification(message, 'info'),
};

export const registerToastHandler = () => {
    // Legacy support: No-op since we use Zustand store directly now
};
