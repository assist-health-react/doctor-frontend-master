import React, { createContext, useContext, useState } from 'react';

const SnackbarContext = createContext();

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info', // 'success', 'error', 'warning', 'info'
  });

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });

    // Auto hide after 5 seconds
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, open: false }));
    }, 5000);
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      {snackbar.open && (
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white ${
            snackbar.severity === 'success' ? 'bg-green-500' :
            snackbar.severity === 'error' ? 'bg-red-500' :
            snackbar.severity === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
          }`}
        >
          {snackbar.message}
          <button
            onClick={hideSnackbar}
            className="ml-4 text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      )}
    </SnackbarContext.Provider>
  );
}; 