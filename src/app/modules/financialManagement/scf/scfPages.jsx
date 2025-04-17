import React, { lazy, Suspense } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { ContentRoute, LayoutSplashScreen } from '../../../../_metronic/layout';
import SCFRegisterCreateEditRenewPage from './scfRegister/createEditRenew/index.jsx';
const SCFRegisterLandingPage = lazy(
  () => import('./scfRegister/landing/index.jsx')
);
const SCFRegisterAutoJournalLog = lazy(
  () => import('./scfRegister/autoJournalLog/index.jsx')
);
const SCFRegisterRepayCreate = lazy(
  () => import('./scfRegister/repay/index.jsx')
);
const SCFRegisterViewPage = lazy(() => import('./scfRegister/view/index.jsx'));
const SCFLimitCreateEditPage = lazy(() => import('./scfLimit/createEdit.jsx'));
const SCFLimitLandingPage = lazy(() => import('./scfLimit/index.jsx'));
const SCFAdviceLanding = lazy(() => import('./scfAdvice/index.jsx'));

const SCFPages = () => {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/financial-management/scf"
          to="/financial-management/scf/scfadvice"
        />

        {/* SCF Limit */}
        <ContentRoute
          path="/financial-management/scf/scflimit/edit/:id"
          component={SCFLimitCreateEditPage}
        />
        <ContentRoute
          path="/financial-management/scf/scflimit/create"
          component={SCFLimitCreateEditPage}
        />
        <ContentRoute
          path="/financial-management/scf/scflimit"
          component={SCFLimitLandingPage}
        />

        {/* SCFAdvice */}
        <ContentRoute
          path="/financial-management/scf/scfadvice"
          component={SCFAdviceLanding}
        />

        {/* SCF Register */}
        {/* // ! Don't Comment Out This Below Line Without Permission of Al Mahmud vai (ERP) */}

        <ContentRoute
          path="/financial-management/scf/scfregister/edit/:editId"
          component={SCFRegisterCreateEditRenewPage}
        />

        <ContentRoute
          path="/financial-management/scf/scfregister/repay/:id"
          component={SCFRegisterRepayCreate}
        />
        <ContentRoute
          path="/financial-management/scf/scfregister/view/:id"
          component={SCFRegisterViewPage}
        />

        <ContentRoute
          path="/financial-management/scf/scfregister/renew/:renewId"
          component={SCFRegisterCreateEditRenewPage}
        />

        <ContentRoute
          path="/financial-management/scf/scfregister/autojournalllog"
          component={SCFRegisterAutoJournalLog}
        />

        <ContentRoute
          path="/financial-management/scf/scfregister/create"
          component={SCFRegisterCreateEditRenewPage}
        />

        <ContentRoute
          path="/financial-management/scf/scfregister"
          component={SCFRegisterLandingPage}
        />
      </Switch>
    </Suspense>
  );
};

export default SCFPages;
