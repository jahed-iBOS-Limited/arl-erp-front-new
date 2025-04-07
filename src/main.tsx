import { createRoot } from 'react-dom/client';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import store, { persistor } from './redux/store';
import App from './App';
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

createRoot(document.getElementById('root')!).render(
  <>
    <MetronicLayoutProvider>
      <MetronicSubheaderProvider>
        <MetronicSplashScreenProvider>
          <App store={store} persistor={persistor} basename={'/'} />
        </MetronicSplashScreenProvider>
      </MetronicSubheaderProvider>
    </MetronicLayoutProvider>
  </>
);
