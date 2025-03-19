import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { Suspense } from "react";
import { ContentRoute, LayoutSplashScreen } from "../../../_metronic/layout";
import CustomerInquiryPages from "./customerInquiry/customerInquiryPages";
import CallCenterReportPages from './report/reportPages';

export default function CallCenterPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/call-center-management"
          to="/call-center-management/customer-inquiry"
        />

        <ContentRoute
          path="/call-center-management/customer-inquiry"
          component={CustomerInquiryPages}
        />
        <ContentRoute
          path="/call-center-management/report"
          component={CallCenterReportPages}
        />
      </Switch>
    </Suspense>
  );
}
