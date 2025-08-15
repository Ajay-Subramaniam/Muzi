import React, { createContext, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

const SnackbarProvider = ({ children }) => {
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'info', anchorOrigin: { vertical: 'top', horizontal: 'center' } });

  const showMessage = (message, severity = 'info', anchorOrigin = { vertical: 'top', horizontal: 'center' }) => {
    setSnack({ open: true, message, severity, anchorOrigin })
  };

  const handleClose = () => {
    setSnack(prev => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}
      <Snackbar open={snack.open} autoHideDuration={2000} onClose={handleClose} anchorOrigin={snack.anchorOrigin}>
        <Alert onClose={handleClose} severity={snack.severity}>
          {snack.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider