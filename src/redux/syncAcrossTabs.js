import storage from 'redux-persist/lib/storage';
import store from './store';
import { persistConfig } from './store';
import { setTokenUpdateActions } from '../app/modules/Auth/_redux/Auth_Actions';
import CryptoJS from 'crypto-js';

export const syncStoreAcrossTabs = () => {
  window.addEventListener('storage', async (event) => {
    if (event.key === `persist:${persistConfig.key}`) {
      try {
        const newState = await storage.getItem(`persist:${persistConfig.key}`);
        if (!newState) {
          console.warn('No new state found in storage');
          return;
        }

        let parsedState;
        try {
          parsedState = JSON.parse(newState);
        } catch (parseError) {
          console.error('Failed to parse persisted state:', parseError);
          return;
        }

        let output = parsedState?.authData?.replace(/^"|"$/g, '');
        if (!output) {
          console.warn('authData is missing or empty');
          return;
        }

        let decrypted;
        try {
          const bytes = CryptoJS.AES.decrypt(output, '7061737323313233');
          decrypted = bytes.toString(CryptoJS.enc.Utf8);
          if (!decrypted) throw new Error('Decryption returned empty string');
        } catch (decryptError) {
          console.error('Failed to decrypt auth data:', decryptError);
          return;
        }

        try {
          const parsedDecrypted = JSON.parse(decrypted);
          const prviousToken = store.getState().authData?.tokenData?.token;
          const newToken = parsedDecrypted?.tokenData?.token;
          if (prviousToken && newToken) {
            if (prviousToken !== newToken) {
              store.dispatch(setTokenUpdateActions(parsedDecrypted?.tokenData));
              console.log('Token updated in store:');
            }
          }
        } catch (decryptedParseError) {
          console.error(
            'Failed to parse decrypted auth data:',
            decryptedParseError
          );
        }
      } catch (err) {
        console.error('Unexpected error handling storage event:', err);
      }
    }
  });
};
