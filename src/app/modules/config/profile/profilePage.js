import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import ChangePassword from "./changePassword";

export function ProfilePages() {

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/config/partner-management"
        to="/config/profile/change-new-password"
      />

      <ContentRoute
        from="/config/profile/change-new-password"
        component={ChangePassword}
      />
    </Switch>
  );
}
