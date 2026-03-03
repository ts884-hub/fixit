'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const typeClasses: Record<ToastType, string> = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-sky-500 text-white',
};

const typeIcons: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++counterRef.current;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={[
              'flex items-start gap-3 rounded-lg px-4 py-3 shadow-lg shadow-black/40 animate-in',
              typeClasses[toast.type],
            ].join(' ')}
          >
            <span className="text-sm font-bold mt-0.5">{typeIcons[toast.type]}</span>
            <p className="flex-1 text-sm">{toast.message}</p>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-white/70 hover:text-white text-xs ml-2 mt-0.5"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

// ─── Inline alert (non-toast, used inline in forms) ──────────────────────────

type AlertType = ToastType;

interface AlertProps {
  type: AlertType;
  message: string;
  onDismiss?: () => void;
}

const alertClasses: Record<AlertType, string> = {
  success: 'bg-emerald-400/10 border-emerald-400/20 text-emerald-300',
  error: 'bg-red-400/10 border-red-400/20 text-red-300',
  info: 'bg-sky-400/10 border-sky-400/20 text-sky-300',
};

export function Alert({ type, message, onDismiss }: AlertProps) {
  return (
    <div
      className={[
        'flex items-start gap-2 rounded-lg border px-4 py-3 text-sm',
        alertClasses[type],
      ].join(' ')}
      role="alert"
    >
      <span className="font-bold mt-0.5">{typeIcons[type]}</span>
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="opacity-60 hover:opacity-100 ml-2"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
}
