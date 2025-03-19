import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Switch, Redirect } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import ApprovedReport from "./approvedReport";
import DateWiseReport from "./dateWiseReport";
import DonationReceiverReport from "./donationReceiverReport";
import MonthWiseReport from "./monthWiseReport";
import PaymentStatus from "./paymentStatus";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";

export function ReportPages() {
  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let approveReport = null;
  let dateWiseReport = null;
  let monthWiseReport = null;
  let paymentStatus = null;
  let donationReceiver = null;
  userRole.forEach((item) => {
    if (item?.intFeatureId === 968) {
      approveReport = item;
    }
    if (item?.intFeatureId === 969) {
      dateWiseReport = item;
    }
    if (item?.intFeatureId === 971) {
      paymentStatus = item;
    }
    if (item?.intFeatureId === 970) {
      monthWiseReport = item;
    }
    if (item?.intFeatureId === 972) {
      donationReceiver = item;
    }
  });

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/trustmgmt/report"
        to="/trustmgmt/report/approvedReport"
      />

      <ContentRoute
        path="/trustmgmt/report/approvedReport"
        component={approveReport?.isView ? ApprovedReport : NotPermittedPage}
      />
      <ContentRoute
        path="/trustmgmt/report/dateWiseReport"
        component={dateWiseReport?.isView ? DateWiseReport : NotPermittedPage}
      />
      <ContentRoute
        path="/trustmgmt/report/monthWiseReport"
        component={monthWiseReport?.isView ? MonthWiseReport : NotPermittedPage}
      />
      <ContentRoute
        path="/trustmgmt/report/paymentStatus"
        component={paymentStatus?.isView ? PaymentStatus : NotPermittedPage}
      />
      <ContentRoute
        path="/trustmgmt/report/donationReceiverReport"
        component={
          donationReceiver?.isView ? DonationReceiverReport : NotPermittedPage
        }
      />
    </Switch>
  );
}
