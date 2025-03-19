import Axios from 'axios';
import React from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-quill/dist/quill.snow.css';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';
import { LayoutSplashScreen, MaterialThemeProvider } from './_metronic/layout';
import { Routes } from './app/Routes';
import {
  makeDecryption,
  makeEncryption,
} from './app/modules/_helper/encryption';
import { withEncryptedAPI } from './app/modules/_helper/withEncryptedAPI';
import { setIsExpiredTokenActions } from './app/modules/Auth/_redux/Auth_Actions';
import useServiceWorkerUpdate from './app/modules/_helper/useServiceWorkerUpdate';

const origin = window.location.origin;
const isDevelopmentOrDevHost = () => {
  return import.meta.env.MODE === 'development' ||
    window.location?.hostname === 'deverp.ibos.io'
    ? true
    : false;
};

export const imarineBaseUrl = isDevelopmentOrDevHost()
  ? 'https://devimarine.ibos.io'
  : 'https://imarine.ibos.io';

export const marineBaseUrlPythonAPI = isDevelopmentOrDevHost()
  ? 'https://devmarine.ibos.io'
  : 'https://marine.ibos.io';

export const eProcurementBaseURL = isDevelopmentOrDevHost()
  ? 'https://devarl.peopledesk.io/api'
  : 'https://arl.peopledesk.io/api';

export const APIUrl = isDevelopmentOrDevHost()
  ? 'https://deverp.ibos.io'
  : window.location?.hostname === 'deverpv2.ibos.io'
  ? 'https://erp.ibos.io'
  : origin;

Axios.defaults.baseURL = APIUrl;

interface AppProps {
  store: any;
  persistor: any;
  basename: any;
}

const App: React.FC<AppProps> = ({ store, persistor, basename }) => {
  const { updateAvailable } = useServiceWorkerUpdate();
  // Request Interceptor
  Axios.interceptors.request.use(
    async (config) => {
      let url = config?.url;

      // Check if the URL should be encrypted
      if (withEncryptedAPI?.some((element: any) => url?.includes(element))) {
        let newConfig = { ...config };

        // Encrypt query parameters if present in the URL
        const apiPrefixes = url?.includes('?');
        if (apiPrefixes) {
          const splitUrl = url?.split('?');
          const encryptedData = await makeEncryption(splitUrl?.[1]);
          url = `${splitUrl?.[0]}?${encryptedData}`;

          newConfig = { ...config, url };
        }

        // Encrypt the request body data if present
        let payload = null;
        if (config?.data) {
          payload = await makeEncryption(JSON.stringify(config?.data));
        }
        newConfig = {
          ...newConfig,
          data: payload,
          headers: { ...newConfig.headers, 'Content-Type': 'application/json' },
        };

        return newConfig;
      }

      // If the URL is not in withEncryptedAPI, no encryption is required
      return config;
    },
    async (error) => {
      console.log('Request Error:', error);
      const url = error?.config?.url;
      if (withEncryptedAPI?.some((element: any) => url?.includes(element))) {
        const decryptedData = await makeDecryption(error?.response?.data);
        const newError: any = { response: { data: decryptedData } };

        const resMessage =
          newError?.message ||
          newError?.Message ||
          newError?.response?.data?.message ||
          newError?.response?.data?.Message;
        if (
          resMessage ===
          'No authenticationScheme was specified, and there was no DefaultChallengeScheme found. The default schemes can be set using either AddAuthentication(string defaultScheme) or AddAuthentication(Action<AuthenticationOptions> configureOptions).'
        ) {
          store.dispatch(setIsExpiredTokenActions(true));
          return Promise.reject(error);
        }
        return Promise.reject(newError);
      } else {
        const resMessage =
          error?.message ||
          error?.Message ||
          error?.response?.data?.message ||
          error?.response?.data?.Message;
        if (
          resMessage ===
          'No authenticationScheme was specified, and there was no DefaultChallengeScheme found. The default schemes can be set using either AddAuthentication(string defaultScheme) or AddAuthentication(Action<AuthenticationOptions> configureOptions).'
        ) {
          store.dispatch(setIsExpiredTokenActions(true));
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
    },
  );

  // Response Interceptor
  Axios.interceptors.response.use(
    async (response) => {
      const url = response?.config?.url;
      // Check if the response needs to be decrypted
      if (withEncryptedAPI?.some((element: any) => url?.includes(element))) {
        // Decrypt the response data
        const decryptedData = await makeDecryption(response?.data);
        return {
          ...response,
          data: decryptedData,
        };
      }

      // If the URL is not in withEncryptedAPI, no decryption is required
      return response;
    },
    async (error) => {
      console.log('error response', JSON.stringify(error, null, 2));
      const url = error?.config?.url;
      if (withEncryptedAPI?.some((element: any) => url?.includes(element))) {
        const decryptedData = await makeDecryption(error?.response?.data);
        const newError: any = { response: { data: decryptedData } };

        const resMessage =
          newError?.message ||
          newError?.Message ||
          newError?.response?.data?.message ||
          newError?.response?.data?.Message;
        if (
          resMessage ===
          'No authenticationScheme was specified, and there was no DefaultChallengeScheme found. The default schemes can be set using either AddAuthentication(string defaultScheme) or AddAuthentication(Action<AuthenticationOptions> configureOptions).'
        ) {
          store.dispatch(setIsExpiredTokenActions(true));
          return Promise.reject(error);
        }
        return Promise.reject(newError);
      } else {
        const resMessage =
          error?.message ||
          error?.Message ||
          error?.response?.data?.message ||
          error?.response?.data?.Message;
        if (
          resMessage ===
          'No authenticationScheme was specified, and there was no DefaultChallengeScheme found. The default schemes can be set using either AddAuthentication(string defaultScheme) or AddAuthentication(Action<AuthenticationOptions> configureOptions).'
        ) {
          store.dispatch(setIsExpiredTokenActions(true));
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
    },
  );

  if (updateAvailable) {
    alert('New version available. Please refresh the page to update.');
  }
  console.log(updateAvailable, 'updateAvailable');
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<LayoutSplashScreen />}>
        <React.Suspense fallback={<LayoutSplashScreen />}>
          <BrowserRouter basename={basename}>
            <MaterialThemeProvider>
              <ToastContainer position="bottom-right" />
              <Routes />
            </MaterialThemeProvider>
          </BrowserRouter>
        </React.Suspense>
      </PersistGate>
    </Provider>
  );
};

export default App;
