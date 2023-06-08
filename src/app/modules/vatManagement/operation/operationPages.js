import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { Suspense } from "react";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { SalesPages } from "./sales/salesPages";
import { PurchasePages } from "./purchase/purchasePages";
import { ManufacturingPages } from "./manufacturing/manufacturingPages";
import InventoryTransactionPages from "./inventoryTransaction/inventoryTransactionPages";

export function OperationPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect exact={true} from="/operation" to="/operation/sales" />
        {/* SalesPages route */}
        <ContentRoute path="/operation/sales" component={SalesPages} />
        {/* PurchasePages */}
        <ContentRoute path="/operation/purchase" component={PurchasePages} />
        {/* ManufacturingPages */}
        <ContentRoute
          path="/operation/manufacturing"
          component={ManufacturingPages}
        />
        {/* InventoryTransaction */}
        <ContentRoute
          path="/operation/inventoryTransaction"
          component={InventoryTransactionPages}
        />
      </Switch>
    </Suspense>
  );
}

export default OperationPages;
