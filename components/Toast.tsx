
import React, { useEffect, useState } from 'react';
import { LucideCheck, LucideX, LucideAlertCircle, LucideInfo } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 4000,
  persistent = false,
  action,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!persistent) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, persistent]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20',
          text: 'text-emerald-400',
          icon: <LucideCheck size={20} />
        };
      case 'error':
        return {
          bg: 'bg-red-500/10 border-red-500/20',
          text: 'text-red-400',
          icon: <LucideX size={20} />
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20',
          text: 'text-amber-400',
          icon: <LucideAlertCircle size={20} />
        };
      case 'info':
        return {
          bg: 'bg-blue-500/10 border-blue-500/20',
          text: 'text-blue-400',
          icon: <LucideInfo size={20} />
        };
    }
  };

  const styles = getTypeStyles();

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 z-50
        ${isExiting ? 'slide-down' : 'slide-up'}
      `}
    >
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-lg
          ${styles.bg} ${styles.text}
          shadow-lg min-w-[280px] max-w-[400px]
        `}
      >
        <div className="flex-shrink-0">
          {styles.icon}
        </div>
        
        <div className="flex-1 text-sm font-medium">
          {message}
        </div>

        {action && (
          <button
            onClick={action.onClick}
            className="flex-shrink-0 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-white/10 transition-colors"
          >
            {action.label}
          </button>
        )}

        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <LucideX size={16} />
        </button>
      </div>
    </div>
  );
};

// Toast Manager Hook
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const showToast = (props: Omit<ToastProps, 'onClose'>) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { ...props, id, onClose: () => removeToast(id) }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const ToastContainer = () => (
    <>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </>
  );

  return { showToast, ToastContainer };
};
