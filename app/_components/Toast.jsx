'use client';

import * as React from "react";
import * as Toast from "@radix-ui/react-toast";
import "./Toast.css";

const ToastProvider = ({ children }) => {
  return (
    <Toast.Provider swipeDirection="right">
      {children}
      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  );
};

const ToastRoot = ({ title, description, type = "success", open, onOpenChange, action }) => {
  return (
    <Toast.Root 
      className={`ToastRoot ToastRoot--${type}`} 
      open={open} 
      onOpenChange={onOpenChange}
      duration={5000}
    >
      {title && <Toast.Title className="ToastTitle">{title}</Toast.Title>}
      {description && (
        <Toast.Description className="ToastDescription">
          {description}
        </Toast.Description>
      )}
      {action && (
        <Toast.Action className="ToastAction" asChild altText={action.altText || "Action"}>
          {action.element}
        </Toast.Action>
      )}
      <Toast.Close className="ToastClose" asChild>
        <button className="IconButton" aria-label="Close">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </Toast.Close>
    </Toast.Root>
  );
};

// Hook untuk menggunakan toast
export const useToast = () => {
  const [toasts, setToasts] = React.useState([]);

  const addToast = React.useCallback((toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id, open: true };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto remove toast after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 5000);
  }, []);

  const removeToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = React.useCallback((message, options = {}) => {
    addToast({
      type: 'success',
      title: 'Success',
      description: message,
      ...options,
    });
  }, [addToast]);

  const error = React.useCallback((message, options = {}) => {
    addToast({
      type: 'error',
      title: 'Error',
      description: message,
      ...options,
    });
  }, [addToast]);

  const info = React.useCallback((message, options = {}) => {
    addToast({
      type: 'info',
      title: 'Info',
      description: message,
      ...options,
    });
  }, [addToast]);

  const warning = React.useCallback((message, options = {}) => {
    addToast({
      type: 'warning',
      title: 'Warning',
      description: message,
      ...options,
    });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };
};

export { ToastProvider, ToastRoot };
