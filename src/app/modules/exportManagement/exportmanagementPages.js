import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../_metronic/layout";
import ExportTransactionPages from "./exportTransaction/exportTransactionPages";

export function ExportManagementPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/managementExport"
        to="/managementExport/exptransaction"
      />
      <ContentRoute
        path="/managementExport/exptransaction"
        component={ExportTransactionPages}
      />
    </Switch>
  );
}

export default ExportManagementPages;
