import { useNotificationStore } from '../store/notificationStore';

const extractErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error.response?.data?.message) return error.response.data.message;
  if (error.message) return error.message;
  return 'Something went wrong. Please try again.';
};

const toast = {
  success: (message) => useNotificationStore.getState().addNotification(message, 'success'),
  error: (error) => useNotificationStore.getState().addNotification(extractErrorMessage(error), 'error'),
  warning: (message) => useNotificationStore.getState().addNotification(message, 'warning'),
  info: (message) => useNotificationStore.getState().addNotification(message, 'info'),
};

export default toast;
