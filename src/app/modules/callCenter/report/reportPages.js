import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import DeliveryInquiryReport from './deliveryInquiryReport/index';

export default function CallCenterReportPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/call-center-management/report"
        to="/call-center-management/report"
      />

      {/* branch route */}
      <ContentRoute
        path="/call-center-management/report/delivery-inquiry-report"
        component={DeliveryInquiryReport}
      />
    </Switch>
  );
}
