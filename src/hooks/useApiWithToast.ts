import { useState } from 'react';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

interface UseApiWithToastOptions {
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

/**
 * A custom hook for handling API operations with toast notifications
 * @param apiFunction The API function to call
 * @param options Options for toast messages
 * @returns An object with loading state, error state, and a function to execute the API call
 */
export function useApiWithToast<T, P extends any[]>(
  apiFunction: (...args: P) => Promise<T>,
  options: UseApiWithToastOptions = {}
) {
  const {
    successMessage = 'Operation completed successfully',
    errorMessage = 'Operation failed',
    showSuccessToast: shouldShowSuccessToast = true,
    showErrorToast: shouldShowErrorToast = true,
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async (...args: P): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      
      if (shouldShowSuccessToast) {
        showSuccessToast(successMessage);
      }
      
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      
      if (shouldShowErrorToast) {
        showErrorToast(errorMessage);
      }
      
      console.error('API Error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, execute };
}

export default useApiWithToast; 