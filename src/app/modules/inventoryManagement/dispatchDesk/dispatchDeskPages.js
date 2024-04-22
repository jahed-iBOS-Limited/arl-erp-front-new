import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import DispatchDeskLanding from "../dispatchDesk";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";

export function DispatchDeskPages() {
  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let dispatchDeskLandingPermission = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1437) {
      dispatchDeskLandingPermission = userRole[i];
    }
  }

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/inventory-management/inventory-dispatch"
        to="/inventory-management/inventory-dispatch/dispatchdesk"
      />

      <ContentRoute
        path="/inventory-management/inventory-dispatch/dispatchdesk"
        component={
          dispatchDeskLandingPermission?.isView
            ? DispatchDeskLanding
            : NotPermittedPage
        }
      />
    </Switch>
  );
}
