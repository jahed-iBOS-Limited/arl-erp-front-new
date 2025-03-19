import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import { AssetReceiveReport } from "./assetReceive";

export function ReportsPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/personal/report"
        to="/personal/report"
      />

      {/* Asset Assign */}
      <ContentRoute
        from="/personal/report/asset-receive"
        component={AssetReceiveReport}
      />

    </Switch>
  );
}
