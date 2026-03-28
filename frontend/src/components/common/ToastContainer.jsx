import React from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import Toast from './Toast';

const ToastContainer = () => {
  const notifications = useNotificationStore((state) => state.notifications);

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <div className="pointer-events-auto flex flex-col gap-3">
        {notifications.map((n) => (
          <Toast key={n.id} {...n} />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
