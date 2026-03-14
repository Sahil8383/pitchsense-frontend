'use client';

import { useToast as useToastContext } from '@/contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

const typeClasses = {
  success: 'bg-success-bg text-success border-success/20',
  error: 'bg-destructive-bg text-destructive border-destructive/20',
  info: 'bg-informative-bg text-informative border-informative/20',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastContext();

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      role="region"
      aria-label="Notifications"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className={`rounded-lg border px-4 py-3 text-sm shadow-lg ${typeClasses[toast.type]}`}
          >
            <div className="flex items-center justify-between gap-4">
              <p>{toast.message}</p>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="shrink-0 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
