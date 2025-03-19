import React from "react";
import { Redirect, Switch } from "react-router-dom";
// import { shallowEqual, useSelector } from "react-redux";
import { ContentRoute } from "../../../../_metronic/layout";
import CustomerChallanFromGhat from "./customerChallanFromGhat/Table/table";
import ProductPrice from "./productPrice/Table/table";
import { TransferChallan } from "./transferChallan/Table/table";
// import findIndex from "../../_helper/_findIndex";

export function AcclReportPages() {
  //   const userRole = useSelector(
  //     (state) => state?.authData?.userRole,
  //     shallowEqual
  //   );

  //   const customerSalesTarget =
  //     userRole[findIndex(userRole, "Customer Sales Target")];

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/sales-management/AcclReport"
        to="/sales-management/AcclReport"
      />

      <ContentRoute
        path="/sales-management/AcclReport/transferChallan"
        component={TransferChallan}
      />

      <ContentRoute
        path="/sales-management/AcclReport/customerChallanFromGhat"
        component={CustomerChallanFromGhat}
      />

      <ContentRoute
        path="/sales-management/AcclReport/productPrice"
        component={ProductPrice}
      />
    </Switch>
  );
}
