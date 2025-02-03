import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { registerSW } from 'virtual:pwa-register';

// Define a return type for the hook
interface UseServiceWorkerUpdateResult {
  updateAvailable: boolean;
  reloadPage: () => void;
}

export default function useServiceWorkerUpdate(): UseServiceWorkerUpdateResult {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        setUpdateAvailable(true);
        toast.info('New version available!', { autoClose: false });
      },
      onOfflineReady() {
        console.log('App is ready to work offline');
      },
    });

    return () => {
      if (updateSW) {
        updateSW();
      }
    };
  }, []);

  const reloadPage = () => {
    window.location.reload();
  };

  return { updateAvailable, reloadPage };
}
