import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import ApproveapprovebillregLanding from "../../financialManagement/invoiceManagementSystem/approvebillregister/index";
import BillregisterLanding from "../../financialManagement/invoiceManagementSystem/billregister";
import BillregisterCreate from "../../financialManagement/invoiceManagementSystem/billregister/billCreate";

export function InvoiceManagementSystemPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const approveBillRegister = userRole.filter(
    (item) => item?.strFeatureName === "Approve Bill Register"
  );

  const billRegister = userRole.filter(
    (item) => item?.intFeatureId === 907
  );

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/payment/invoicemanagement-system"
        to="/payment/invoicemanagement-system/billregister"
      />
      <ContentRoute
        from="/payment/invoicemanagement-system/billregister/create"
        ///financial-management/invoicemanagement-system/billregister/create
        component={billRegister?.[0]?.isCreate ? BillregisterCreate : NotPermittedPage}
      />
      <ContentRoute
        from="/payment/invoicemanagement-system/billregister"
        component={billRegister?.[0]?.isView ? BillregisterLanding : NotPermittedPage}
      />
      <ContentRoute
        from="/payment/invoicemanagement-system/approvebillregister"
        component={
          approveBillRegister[0]?.isCreate
            ? ApproveapprovebillregLanding
            : NotPermittedPage
        }
      />
    </Switch>
  );
}
