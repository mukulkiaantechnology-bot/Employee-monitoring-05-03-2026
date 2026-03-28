import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const toastTypes = {
    success: {
        bg: 'bg-[#22c55e]',
        icon: CheckCircle2,
        dot: 'bg-white',
    },
    error: {
        bg: 'bg-rose-500',
        icon: AlertCircle,
        dot: 'bg-white',
    },
    warning: {
        bg: 'bg-amber-500',
        icon: AlertTriangle,
        dot: 'bg-white',
    },
    info: {
        bg: 'bg-blue-500',
        icon: Info,
        dot: 'bg-white',
    },
};

export const Toast = ({ message, type = 'info', onRemove }) => {
    const [isVisible, setIsVisible] = useState(false);
    const config = toastTypes[type] || toastTypes.info;

    useEffect(() => {
        // Initial animation
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onRemove, 300); // Wait for fade-out animation
    };

    return (
        <div
            className={`
                group flex items-center gap-3 px-4 py-2.5 rounded-full shadow-lg
                transition-all duration-300 ease-out transform
                ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
                ${config.bg} text-white min-w-[280px] max-w-md pointer-events-auto
            `}
        >
            {/* Small dot indicator */}
            <div className={`w-2 h-2 rounded-full ${config.dot} shrink-0 animate-pulse`} />
            
            <span className="text-xs font-bold tracking-tight flex-grow truncate">
                {message}
            </span>

            <button
                onClick={handleClose}
                className="p-1 hover:bg-white/20 rounded-full transition-colors opacity-60 group-hover:opacity-100"
            >
                <X size={14} strokeWidth={3} />
            </button>
        </div>
    );
};

export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    {...toast}
                    onRemove={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};
