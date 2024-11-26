import Axios from "axios";
import React from "react";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-quill/dist/quill.snow.css";
import { Provider, useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import { I18nProvider } from "../_metronic/i18n";
import { LayoutSplashScreen, MaterialThemeProvider } from "../_metronic/layout";
import { Routes } from "../app/Routes";
import { makeDecryption, makeEncryption } from "./modules/_helper/encryption";
import { withEncryptedAPI } from "./modules/_helper/withEncryptedAPI";
import { setIsExpiredTokenActions } from "./modules/Auth/_redux/Auth_Actions";

const origin = window.location.origin;
export const imarineBaseUrl =
  process.env.NODE_ENV === "development" ||
  window.location?.hostname === "deverp.ibos.io"
    ? "https://devimarine.ibos.io"
    : "https://imarine.ibos.io";

export const marineBaseUrlPythonAPI =
  process.env.NODE_ENV === "development" ||
  window.location?.hostname === "deverp.ibos.io"
    ? "https://devmarine.ibos.io"
    : "https://marine.ibos.io";

export const eProcurementBaseURL =
  process.env.NODE_ENV === "development" ||
  window.location?.hostname === "deverp.ibos.io"
    ? "https://devarl.peopledesk.io/api"
    : "https://arl.peopledesk.io/api";

// live-url: https://erp.peopledesk.io

export const APIUrl =
  process.env.NODE_ENV === "development" ? "https://erp.ibos.io" : origin;
Axios.defaults.baseURL = APIUrl;

const App = ({ store, persistor, basename }) => {
  // Request Interceptor
  Axios.interceptors.request.use(
    async (config) => {
      let url = config?.url;

      // Check if the URL should be encrypted
      if (withEncryptedAPI?.some((element) => url?.includes(element))) {
        let newConfig = { ...config };

        // Encrypt query parameters if present in the URL
        const apiPrefixes = url?.includes("?");
        if (apiPrefixes) {
          let splitUrl = url?.split("?");
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
          headers: { ...newConfig.headers, "Content-Type": "application/json" },
        };

        return newConfig;
      }

      // If the URL is not in withEncryptedAPI, no encryption is required
      return config;
    },
    async (error) => {
      console.log("Request Error:", error);
      const url = error?.config?.url;
      if (withEncryptedAPI?.some((element) => url?.includes(element))) {
        let decryptedData = await makeDecryption(error?.response?.data);
        let newError = { response: { data: decryptedData } };

        const resMessage =
          newError?.message ||
          newError?.Message ||
          newError?.response?.data?.message ||
          newError?.response?.data?.Message;
        if (
          resMessage ===
          "No authenticationScheme was specified, and there was no DefaultChallengeScheme found. The default schemes can be set using either AddAuthentication(string defaultScheme) or AddAuthentication(Action<AuthenticationOptions> configureOptions)."
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
          "No authenticationScheme was specified, and there was no DefaultChallengeScheme found. The default schemes can be set using either AddAuthentication(string defaultScheme) or AddAuthentication(Action<AuthenticationOptions> configureOptions)."
        ) {
          store.dispatch(setIsExpiredTokenActions(true));
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
    }
  );

  // Response Interceptor
  Axios.interceptors.response.use(
    async (response) => {
      let url = response?.config?.url;
      // Check if the response needs to be decrypted
      if (withEncryptedAPI?.some((element) => url?.includes(element))) {
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
      console.log("error response", JSON.stringify(error, null, 2));
      const url = error?.config?.url;
      if (withEncryptedAPI?.some((element) => url?.includes(element))) {
        let decryptedData = await makeDecryption(error?.response?.data);
        let newError = { response: { data: decryptedData } };

        const resMessage =
          newError?.message ||
          newError?.Message ||
          newError?.response?.data?.message ||
          newError?.response?.data?.Message;
        if (
          resMessage ===
          "No authenticationScheme was specified, and there was no DefaultChallengeScheme found. The default schemes can be set using either AddAuthentication(string defaultScheme) or AddAuthentication(Action<AuthenticationOptions> configureOptions)."
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
          "No authenticationScheme was specified, and there was no DefaultChallengeScheme found. The default schemes can be set using either AddAuthentication(string defaultScheme) or AddAuthentication(Action<AuthenticationOptions> configureOptions)."
        ) {
          store.dispatch(setIsExpiredTokenActions(true));
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
    }
  );
  return (
    /* Provide Redux store */
    <Provider store={store}>
      {/* Asynchronously persist redux stores and show `SplashScreen` while it's loading. */}
      <PersistGate persistor={persistor} loading={<LayoutSplashScreen />}>
        {/* Add    high level `Suspense` in case if was not handled inside the React tree. */}
        <React.Suspense fallback={<LayoutSplashScreen />}>
          {/* Override `basename` (e.g: `homepage` in `package.json`) */}
          <BrowserRouter basename={basename}>
            {/*This library only returns the location that has been active before the recent location change in the current window lifetime.*/}
            <MaterialThemeProvider>
              {/* Provide `react-intl` context synchronized with Redux state.  */}
              <I18nProvider>
                {/* Render routes with provided `Layout`. */}
                <ToastContainer position="bottom-right" />
                <Routes />
              </I18nProvider>
            </MaterialThemeProvider>
          </BrowserRouter>
        </React.Suspense>
      </PersistGate>
    </Provider>
  );
};
export default App;
