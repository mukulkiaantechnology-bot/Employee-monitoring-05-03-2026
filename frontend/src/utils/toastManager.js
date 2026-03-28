let toastNotificationHandler = null;

export const registerToastHandler = (handler) => {
    toastNotificationHandler = handler;
};

export const toast = {
    success: (message, duration) => toastNotificationHandler?.success(message, duration),
    error: (message, duration) => toastNotificationHandler?.error(message, duration),
    warning: (message, duration) => toastNotificationHandler?.warning(message, duration),
    info: (message, duration) => toastNotificationHandler?.info(message, duration),
};
