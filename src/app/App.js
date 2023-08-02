import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Routes } from "../app/Routes";
import { I18nProvider } from "../_metronic/i18n";
import { LayoutSplashScreen, MaterialThemeProvider } from "../_metronic/layout";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";
import Axios from "axios";
import "react-quill/dist/quill.snow.css";

const origin = window.location.origin;

export const APIUrl =
    process.env.NODE_ENV === "development" ? "https://dev-erp.ibos.io" : origin;
Axios.defaults.baseURL = APIUrl;

const App = ({ store, persistor, basename }) => {
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
