import React from 'react';

/**
 * ToastItem component represent a single toast notification.
 */
function ToastItem({ message, type = 'success', onClose }) {
  const isSuccess = type === 'success';

  return (
    <div className="toast-item glass-panel" role="alert">
      <div className="toast-message">
        {isSuccess ? (
          // Check icon SVG
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent-color)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ) : (
          // Info/Alert icon SVG
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="oklch(0.6 0.18 20)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        )}
        <span>{message}</span>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Dismiss notification">
        &times;
      </button>
    </div>
  );
}

/**
 * ToastContainer component
 * Manages the layout and rendering of all active toasts on the screen.
 * 
 * @param {Object} props
 * @param {Array} props.toasts - Active toasts array
 * @param {Function} props.removeToast - Function to remove a toast by ID
 */
export default function ToastContainer({ toasts = [], removeToast }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" id="toast-container-root">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
