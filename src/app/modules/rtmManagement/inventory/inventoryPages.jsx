import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import InventoryStatementTable from "./inventoryStatement/table/table";

export function InventoryPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/inventory"
        to="/rtm-management/inventory"
      />

      {/* inventory statement*/}
      <ContentRoute
        path="/rtm-management/inventory/inventoryReport"
        component={InventoryStatementTable}
      />
    </Switch>
  );
}
export default InventoryPages;
