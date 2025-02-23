import React, { lazy, Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
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
      </Switch>
    </Suspense>
  );
};

export default SCFPages;
