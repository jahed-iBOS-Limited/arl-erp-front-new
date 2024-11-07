/* eslint-disable no-unused-vars */
import React, { lazy, Suspense, useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LayoutSplashScreen } from '../_metronic/layout';
import { useKeyPress } from './modules/_helper/useKeyPress';
import PaymentPages from './modules/payment/PaymentPages';
import SelfServicePages from './modules/selfService/SelfServicePages';
import TokenExpiredPopUp from './TokenExpiredPopUp';
import MobileFirstAlert from './modules/_helper/mobileFirstAlert';

const ShippingOperaionPages = lazy(() =>
  import('./modules/shippingOperation/shippingOperationPages.js'),
);
const procurementPages = lazy(() =>
  import('./modules/procurement/procurementPages'),
);
const SafetyComplianceMainPages = lazy(() =>
  import('./modules/safetyCompliance/SafetyComplianceMainPages'),
);
const TrustMgmtPages = lazy(() => import('./modules/trustMgmt/TrustMgmtPages'));
const configPages = lazy(() => import('./modules/config/configPages'));
const financialManagementPages = lazy(() =>
  import('./modules/financialManagement/financialManagementPages'),
);
const inventoryManagementPages = lazy(() =>
  import('./modules/inventoryManagement/inventoryManagementPages'),
);
// const HumanCapitalManagementPages = lazy(() =>
//   import("./modules/humanCapitalManagement/humanCapitalManagementPages")
// );

const LearningAndDevelopmentPages = lazy(() =>
  import('./modules/learningAndDevelopment/learningAndDevelopmentPages'),
);

const productionPages = lazy(() =>
  import('./modules/productionManagement/productionPages.js'),
);
const SalesManagementPages = lazy(() =>
  import('./modules/salesManagement/salesManagementPages.js'),
);
const InternalControlPages = lazy(() =>
  import('./modules/internalControl/internalControlPages.js'),
);

const PersonalPages = lazy(() => import('./modules/personal/personalPages'));

const TransportManagementPages = lazy(() =>
  import('./modules/transportManagement/transportManagementPages'),
);

const AssetManagementPages = lazy(() =>
  import('./modules/assetManagement/AssetManagementPages'),
);
const ChatPages = lazy(() => import('./modules/chats/chatsPages'));
const PerformanceMgtPages = lazy(() =>
  import('./modules/performanceManagement/performanceMgtPages'),
);
const VatManagementPages = lazy(() =>
  import('./modules/vatManagement/vatManagementPages'),
);
const TransPortManagementPages = lazy(() =>
  import('./modules/transportManagement/transportManagementPages'),
);
const RtmManagementPages = lazy(() =>
  import('./modules/rtmManagement/rtmManagementPages'),
);

const ImportManagementPages = lazy(() =>
  import('./modules/importManagement/importManagementPages'),
);

const AttachmentViewer = lazy(() =>
  import('./modules/_helper/attachmentViewer'),
);
const MultipleAttachmentViewer = lazy(() =>
  import('./modules/_helper/multipleAttachmentViewer'),
);
const PosManagementPages = lazy(() =>
  import('./modules/posManagement/posManagementPages'),
);

const CallCenterPages = lazy(() =>
  import('./modules/callCenter/callCenterPages'),
);
const VesselManagementPages = lazy(() =>
  import('./modules/vesselManagement/vesselManagementPages'),
);

const CharteringPages = lazy(() =>
  import('./modules/chartering/charteringPages'),
);

const HashPerformanceMgtPages = lazy(() =>
  import('./modules/hashPerformanceManagement/HashPerformanceMgtPages'),
);
const ExportManagementPages = lazy(() =>
  import('./modules/exportManagement/exportmanagementPages'),
);
const PowerBIPages = lazy(() => import('./modules/powerBI/powerBIPages'));
const ShippingAgencyPages = lazy(() =>
  import('./modules/shippingAgency/shippingAgencyPages.js'),
);
const CargoManagementPages = lazy(() =>
  import('./modules/CargoManagement/cargoManagementPages.js'),
);
const BasePage = () => {
  const { isExpiredToken, isAuth, isExpiredPassword } = useSelector(
    (state) => state?.authData,
    shallowEqual,
  );
  // const isExpiredToken = true;
  // const isAuth = true;

  useEffect(() => {
    const offlineMessageFunc = (event) => {
      toast.warning('No Internet connection', {
        toastId: 'offline',
      });
    };
    const onlineMessageFunc = (event) => {
      toast.success('Back Online', {
        toastId: 'online',
      });
    };
    window.addEventListener('offline', offlineMessageFunc);
    window.addEventListener('online', onlineMessageFunc);
    return () => {
      window.removeEventListener('offline', offlineMessageFunc);
      window.removeEventListener('online', onlineMessageFunc);
    };
  }, []);
  const history = useHistory();
  const onKeyPress = (event) => {
    //Sales Invoice Page Redirect
    if (event.altKey && event.code === 'KeyV') {
      event.preventDefault();
      history.push('/mngVat/sales/salesInvoiceiBOS');
    }
  };
  useKeyPress(['Alt', 'v'], onKeyPress);
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <AttachmentViewer />
      <MultipleAttachmentViewer />
      <MobileFirstAlert />
      {/* <ChatApp /> */}
      <Switch>
        {<Redirect exact from="/" to="/self-service/self-dashboard" />}
        {/* <Route path="/dashboard" component={DashboardPage} /> */}
        <Route path="/chat" component={ChatPages} />
        <Route
          path="/safety-compliance"
          component={SafetyComplianceMainPages}
        />
        <Route path="/mngProcurement" component={procurementPages} />
        <Route path="/config" component={configPages} />
        <Route
          path="/financial-management"
          component={financialManagementPages}
        />
        <Route path="/payment" component={PaymentPages} />
        <Route
          path="/inventory-management"
          component={inventoryManagementPages}
        />
        {/* <Route
          path="/human-capital-management"
          component={HumanCapitalManagementPages}
        /> */}
        <Route
          path="/learningDevelopment"
          component={LearningAndDevelopmentPages}
        />
        <Route path="/trustmgmt" component={TrustMgmtPages} />
        <Route path="/self-service" component={SelfServicePages} />
        <Route path="/performance-management" component={PerformanceMgtPages} />
        <Route path="/production-management" component={productionPages} />
        <Route path="/sales-management" component={SalesManagementPages} />
        <Route path="/internal-control" component={InternalControlPages} />
        <Route path="/mngVat/" component={VatManagementPages} />
        <Route
          path="/transport-management"
          component={TransPortManagementPages}
        />
        <Route path="/personal" component={PersonalPages} />
        <Route path="/mngAsset" component={AssetManagementPages} />
        <Route
          path="/transport-management"
          component={TransportManagementPages}
        />
        <Route path="/rtm-management" component={RtmManagementPages} />
        <Route path="/managementImport" component={ImportManagementPages} />
        <Route path="/pos-management" component={PosManagementPages} />
        <Route path="/call-center-management" component={CallCenterPages} />
        <Route path="/vessel-management" component={VesselManagementPages} />
        <Route path="/chartering" component={CharteringPages} />
        <Route path="/powerbi" component={PowerBIPages} />
        <Route path="/MgmtOfPerformance" component={HashPerformanceMgtPages} />
        <Route path="/managementExport" component={ExportManagementPages} />
        <Route path="/ShippingAgency" component={ShippingAgencyPages} />
        <Route path="/shippingOperation" component={ShippingOperaionPages} />
        <Route path="/cargoManagement" component={CargoManagementPages} />
        <Redirect to="/error/error-v1" />
      </Switch>
      {(isExpiredToken || isExpiredPassword) && isAuth && (
        <>
          <TokenExpiredPopUp />
        </>
      )}
    </Suspense>
  );
};

export default BasePage;
