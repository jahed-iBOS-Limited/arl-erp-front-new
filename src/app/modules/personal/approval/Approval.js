import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import { CommonApprovalPage } from "./commonApproval";
import findIndex from "./../../_helper/_findIndex";
import NotPermittedPage from "./../../_helper/notPermitted/NotPermittedPage";

export function ApprovalPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const commonApproval = userRole[findIndex(userRole, "Common Approval")];

  return (
    <Switch>
      <Redirect exact={true} from="/personal" to="/personal/approval" />

      {/* Common Approval */}
      <ContentRoute
        from="/personal/approval/commonapproval"
        component={
          commonApproval?.isCreate ? CommonApprovalPage : NotPermittedPage
        }
      />
    </Switch>
  );
}
