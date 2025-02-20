import React, { lazy, Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
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
        <ContentRoute
          path="/financial-management/scf/scfadvice"
          component={SCFAdviceLanding}
        />
      </Switch>
    </Suspense>
  );
};

export default SCFPages;
