import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Switch, Redirect } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import ApplicationApprove from "./applicationApprove";
import PaymentPrepare from "./paymentPrepare";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";

export function AccountsPages() {
  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let approve = null;
  let preparePayment = null;
  userRole.forEach((item) => {
    if (item?.intFeatureId === 973) {
      approve = item;
    }
    if (item?.intFeatureId === 974) {
      preparePayment = item;
    }
  });

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/trustmgmt/accounts"
        to="/trustmgmt/accounts/applicationApprove"
      />

      <ContentRoute
        path="/trustmgmt/accounts/applicationApprove"
        component={approve?.isCreate ? ApplicationApprove : NotPermittedPage}
      />
      <ContentRoute
        path="/trustmgmt/accounts/preparePayment"
        component={preparePayment?.isCreate ? PaymentPrepare : NotPermittedPage}
      />
    </Switch>
  );
}
