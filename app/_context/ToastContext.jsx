'use client';

import React, { createContext, useContext } from 'react';
import { ToastProvider as RadixToastProvider, ToastRoot } from '../_components/Toast';

const ToastContext = createContext({});

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([]);

  const addToast = React.useCallback((toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { 
      ...toast, 
      id, 
      open: true,
      duration: toast.duration || 5000 
    };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }, []);

  const removeToast = React.useCallback((id) => {
    setToasts((prev) => prev.map(toast => 
      toast.id === id ? { ...toast, open: false } : toast
    ));
    
    // Remove from array after animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 200);
  }, []);

  const success = React.useCallback((message, options = {}) => {
    addToast({
      type: 'success',
      title: options.title || 'Success',
      description: message,
      ...options,
    });
  }, [addToast]);

  const error = React.useCallback((message, options = {}) => {
    addToast({
      type: 'error',
      title: options.title || 'Error',
      description: message,
      ...options,
    });
  }, [addToast]);

  const info = React.useCallback((message, options = {}) => {
    addToast({
      type: 'info',
      title: options.title || 'Information',
      description: message,
      ...options,
    });
  }, [addToast]);

  const warning = React.useCallback((message, options = {}) => {
    addToast({
      type: 'warning',
      title: options.title || 'Warning',
      description: message,
      ...options,
    });
  }, [addToast]);

  const contextValue = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      <RadixToastProvider>
        {children}
        {toasts.map((toast) => (
          <ToastRoot
            key={toast.id}
            title={toast.title}
            description={toast.description}
            type={toast.type}
            open={toast.open}
            onOpenChange={(open) => {
              if (!open) {
                removeToast(toast.id);
              }
            }}
            action={toast.action}
          />
        ))}
      </RadixToastProvider>
    </ToastContext.Provider>
  );
};
