import React, { Suspense } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../_metronic/layout";
import NotPermittedPage from "../_helper/notPermitted/NotPermittedPage";
import { GatePass } from "./GatePass/GatePass";
import { ConfigurationPages } from "./configuration/configurationPages";
import DispatchDeskLanding from "./dispatchDesk";
import CreateInventoryLoanForm from "./inventoryLoan/form/addEditForm";
import { ReportsPages } from "./reports/reportsPages";
import { WarehouseManagementPages } from "./warehouseManagement/warehouseManagementPages";

export function InventoryManagementPages() {

  const { userRole } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  let inventoryLoan = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1035) {
      inventoryLoan = userRole[i];
    }
  }

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/inventory-management"
          to="/inventory-management/configuration/plant"
        />

        <ContentRoute
          path="/inventory-management/configuration"
          component={ConfigurationPages}
        />

        <ContentRoute
          path="/inventory-management/warehouse-management"
          component={WarehouseManagementPages}
        />

        <ContentRoute
          path="/inventory-management/reports"
          component={ReportsPages}
        />
        <ContentRoute
          path="/inventory-management/gate-pass"
          component={GatePass}
        />
        <ContentRoute
          path="/inventory-management/inventory-DispatchDesk"
          component={DispatchDeskLanding}
        />

        {/* Inventory Load */}
        <ContentRoute
          path="/inventory-management/inventory-loan/inventory-loan/create"
          component={inventoryLoan?.isCreate ? CreateInventoryLoanForm : NotPermittedPage}
        />
        {/* <ContentRoute
          path="/inventory-management/inventory-loan/inventory-loan"
          component={InventoryLoadLanding}
        /> */}
        
      </Switch>
    </Suspense>
  );
}

export default InventoryManagementPages;
