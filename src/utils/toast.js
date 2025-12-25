// Override toast.error to disable error notifications
import { toast as originalToast } from 'react-toastify';

// Create a custom toast object that overrides error method
export const toast = {
  ...originalToast,
  error: () => {
    // Do nothing - errors are handled silently
  },
  success: originalToast.success,
  info: originalToast.info,
  warning: originalToast.warning,
};

export default toast;

