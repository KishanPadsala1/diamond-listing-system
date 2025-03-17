import { toast, ToastOptions } from 'react-toastify';

// Default toast options
const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Success toast
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  return toast.success(message, { ...defaultOptions, ...options });
};

// Error toast
export const showErrorToast = (message: string, options?: ToastOptions) => {
  return toast.error(message, { ...defaultOptions, ...options });
};

// Info toast
export const showInfoToast = (message: string, options?: ToastOptions) => {
  return toast.info(message, { ...defaultOptions, ...options });
};

// Warning toast
export const showWarningToast = (message: string, options?: ToastOptions) => {
  return toast.warning(message, { ...defaultOptions, ...options });
};

// Toast for API responses
export const handleApiResponse = (
  success: boolean,
  successMessage: string,
  errorMessage: string = 'An error occurred'
) => {
  if (success) {
    showSuccessToast(successMessage);
  } else {
    showErrorToast(errorMessage);
  }
};

// Toast for API errors
export const handleApiError = (error: any, defaultMessage: string = 'An error occurred') => {
  const errorMessage = error?.response?.data?.message || error?.message || defaultMessage;
  showErrorToast(errorMessage);
}; 