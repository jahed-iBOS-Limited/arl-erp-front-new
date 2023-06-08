import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import PreRawMaterialReceive from "./preRawMaterialReceive";
import PreRawMaterialReceiveCreate from "./preRawMaterialReceive/Form/addEditForm";

export function MsilStoreDepartmentPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let preRawMaterialRecieve = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1091) {
      preRawMaterialRecieve = userRole[i];
    }
  }

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/production-management"
        to="/production-management/msil-Rolling"
      />
      <ContentRoute
        path="/production-management/msil-Store/PreRawMaterialReceive/edit/:id"
        component={
          preRawMaterialRecieve?.isEdit
            ? PreRawMaterialReceiveCreate
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Store/PreRawMaterialReceive/create"
        component={
          preRawMaterialRecieve?.isCreate
            ? PreRawMaterialReceiveCreate
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Store/PreRawMaterialReceive"
        component={
          preRawMaterialRecieve?.isView
            ? PreRawMaterialReceive
            : NotPermittedPage
        }
      />
    </Switch>
  );
}
