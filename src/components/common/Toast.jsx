import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import './Toast.css';

const Toast = ({
    message,
    type = 'info',
    duration = 3000,
    onClose,
    position = 'top-right'
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose?.();
        }, 300);
    };

    const icons = {
        success: <CheckCircle size={20} />,
        error: <AlertCircle size={20} />,
        warning: <AlertTriangle size={20} />,
        info: <Info size={20} />
    };

    if (!isVisible) return null;

    return (
        <div className={`toast toast-${type} toast-${position} ${isVisible ? 'toast-enter' : 'toast-exit'}`}>
            <div className="toast-icon">{icons[type]}</div>
            <div className="toast-message">{message}</div>
            <button className="toast-close" onClick={handleClose} aria-label="Close">
                <X size={16} />
            </button>
        </div>
    );
};

// Toast Container Component
export const ToastContainer = ({ toasts = [], position = 'top-right', removeToast }) => {
    return (
        <div className={`toast-container toast-container-${position}`}>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    {...toast}
                    position={position}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

export default Toast;
