import Axios from 'axios';
import React from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-quill/dist/quill.snow.css';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';
import { LayoutSplashScreen, MaterialThemeProvider } from '../_metronic/layout';
import { Routes } from '../app/Routes';
import { makeDecryption, makeEncryption } from './modules/_helper/encryption';
import { withEncryptedAPI } from './modules/_helper/withEncryptedAPI';
import { setIsExpiredTokenActions } from './modules/Auth/_redux/Auth_Actions';

const origin = window.location.origin;
export const imarineBaseUrl =
  process.env.NODE_ENV === 'development' ||
  window.location?.hostname === 'deverp.ibos.io'
    ? 'https://devimarine.ibos.io'
    : 'https://imarine.ibos.io';

export const marineBaseUrlPythonAPI =
  process.env.NODE_ENV === 'development' ||
  window.location?.hostname === 'deverp.ibos.io'
    ? 'https://devmarine.ibos.io'
    : 'https://marine.ibos.io';

export const eProcurementBaseURL =
  process.env.NODE_ENV === 'development' ||
  window.location?.hostname === 'deverp.ibos.io'
    ? 'https://devarl.peopledesk.io/api'
    : 'https://arl.peopledesk.io/api';

// live-url: https://erp.peopledesk.io

export const APIUrl =
  process.env.NODE_ENV === 'development' ? 'https://deverp.ibos.io' : origin;
Axios.defaults.baseURL = APIUrl;

const handleError = async (error, store) => {
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
  }

  if (
    withEncryptedAPI?.some((element) => error?.config?.url?.includes(element))
  ) {
    const decryptedData = await makeDecryption(error?.response?.data);
    return Promise.reject({ response: { data: decryptedData } });
  }

  return Promise.reject(error);
};

const handleRequest = async (config) => {
  let url = config?.url;

  if (withEncryptedAPI?.some((element) => url?.includes(element))) {
    let newConfig = { ...config };

    if (url?.includes('?')) {
      const [baseUrl, queryParams] = url.split('?');
      const encryptedData = await makeEncryption(queryParams);
      url = `${baseUrl}?${encryptedData}`;
      newConfig = { ...config, url };
    }

    if (config?.data) {
      const payload = await makeEncryption(JSON.stringify(config?.data));
      newConfig = {
        ...newConfig,
        data: payload,
        headers: { ...newConfig.headers, 'Content-Type': 'application/json' },
      };
    }

    return newConfig;
  }

  return config;
};

const handleResponse = async (response) => {
  if (
    withEncryptedAPI?.some((element) =>
      response?.config?.url?.includes(element),
    )
  ) {
    const decryptedData = await makeDecryption(response?.data);
    return { ...response, data: decryptedData };
  }

  return response;
};

const App = ({ store, persistor, basename }) => {
  Axios.interceptors.request.use(handleRequest, (error) =>
    handleError(error, store),
  );
  Axios.interceptors.response.use(handleResponse, (error) =>
    handleError(error, store),
  );
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
