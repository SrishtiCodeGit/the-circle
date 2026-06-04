import { createContext, useContext, useState, useCallback } from 'react';
import '../components/Toast.css';

const ToastContext = createContext(null);

let _id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [dismissing, setDismissing] = useState({});

  const dismiss = useCallback((id) => {
    setDismissing(d => ({ ...d, [id]: true }));
    setTimeout(() => {
      setToasts(t => t.filter(x => x.id !== id));
      setDismissing(d => { const n = { ...d }; delete n[id]; return n; });
    }, 350);
  }, []);

  const add = useCallback((type, msg) => {
    const id = ++_id;
    setToasts(t => [...t.slice(-3), { id, type, msg }]);
    setTimeout(() => dismiss(id), 3500);
  }, [dismiss]);

  const toast = {
    success: (msg) => add('success', msg),
    error: (msg) => add('error', msg),
    info: (msg) => add('info', msg),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`toast toast-${t.type} ${dismissing[t.id] ? 'toast-out' : ''}`}
          >
            <span className="toast-icon">
              {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
            </span>
            <span className="toast-msg">{t.msg}</span>
            <button className="toast-close" onClick={() => dismiss(t.id)}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
