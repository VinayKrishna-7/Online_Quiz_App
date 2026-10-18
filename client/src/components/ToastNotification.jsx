import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div style={{
      position: 'fixed',
      top: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '380px',
      width: '100%',
    }}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: {
      bg: 'var(--success-light)',
      border: 'var(--success-border)',
      color: 'var(--success-text)',
      icon: <CheckCircle2 size={18} color="var(--success)" />,
    },
    error: {
      bg: 'var(--danger-light)',
      border: 'var(--danger-border)',
      color: 'var(--danger-text)',
      icon: <AlertCircle size={18} color="var(--danger)" />,
    },
    warning: {
      bg: 'var(--warning-light)',
      border: 'var(--warning-border)',
      color: 'var(--warning-text)',
      icon: <AlertCircle size={18} color="var(--warning)" />,
    },
    info: {
      bg: 'var(--primary-light)',
      border: 'var(--primary-border)',
      color: 'var(--primary)',
      icon: <Info size={18} color="var(--primary)" />,
    },
  }[toast.type || 'info'];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.875rem 1rem',
      backgroundColor: styles.bg,
      border: `1px solid ${styles.border}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      color: styles.color,
      fontSize: '0.875rem',
      fontWeight: 500,
      animation: 'slideIn 0.2s ease-out forwards',
    }}>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      <div style={{ flexShrink: 0 }}>{styles.icon}</div>
      <div style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</div>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          opacity: 0.7,
          display: 'flex',
          padding: '2px',
          cursor: 'pointer',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default ToastContainer;
