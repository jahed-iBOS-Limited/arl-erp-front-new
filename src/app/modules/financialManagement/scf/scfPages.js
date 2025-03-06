import React, { lazy, Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import SCFRegisterCreateEditRenewPage from "./scfRegister/createEditRenew/index.js";
import SCFRegisterLandingPage from "./scfRegister/landing/index.js";
import SCFRegisterAutoJournalLog from "./scfRegister/autoJournalLog/index.js";
import SCFRegisterRepayCreate from "./scfRegister/repay/index.js";
import SCFRegisterViewPage from "./scfRegister/view/index.js";
const SCFLimitCreateEditPage = lazy(() => import("./scfLimit/createEdit.js"));
const SCFLimitLandingPage = lazy(() => import("./scfLimit/index.js"));
const SCFAdviceLanding = lazy(() => import("./scfAdvice/index.js"));

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
