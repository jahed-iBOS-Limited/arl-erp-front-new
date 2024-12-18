import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import store, { persistor } from './redux/store';
import App from './app/App';
import './index.scss'; // Standard version
import './_metronic/_assets/plugins/keenthemes-icons/font/ki.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './_metronic/_assets/plugins/flaticon/flaticon.css';
import {
  MetronicLayoutProvider,
  MetronicSplashScreenProvider,
  MetronicSubheaderProvider,
} from './_metronic/layout';
import './app.css';
import * as serviceWorker from './serviceWorker';
const { PUBLIC_URL } = process.env;
ReactDOM.render(
  <>
    <MetronicLayoutProvider>
      <MetronicSubheaderProvider>
        <MetronicSplashScreenProvider>
          <App store={store} persistor={persistor} basename={PUBLIC_URL} />
        </MetronicSplashScreenProvider>
      </MetronicSubheaderProvider>
    </MetronicLayoutProvider>
  </>,
  document.getElementById('root'),
);
serviceWorker.register();
