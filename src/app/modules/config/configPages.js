import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { DomainControllPages } from "./domainControll/domainControllPages";
import { LayoutSplashScreen, ContentRoute } from "../../../_metronic/layout";
import { MaterialPages } from "./material-management/materialPages";
import { PartnerPages } from "./partner-management/partnerPage";
import { Suspense } from "react";
import { ProfilePages } from './profile/profilePage';

export function configPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/config"
          to="/config/domain-controll/business-unit"
        />

        <ContentRoute
          path="/config/domain-controll"
          component={DomainControllPages}
        />

        <ContentRoute
          path="/config/material-management"
          component={MaterialPages}
        />
        <ContentRoute
          path="/config/partner-management"
          component={PartnerPages}
        />
        <ContentRoute
          path="/config/partner-management"
          component={PartnerPages}
        />
        <ContentRoute
          path="/config/profile"
          component={ProfilePages}
        />
      </Switch>
    </Suspense>
  );
}

export default configPages;
