import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import ComplainForm from "./complain/form/addEditForm";
import ComplainLanding from "./complain/landing";
import ComplainAssignConfigLanding from "./complaintAssignConfig";
import ComplainAssignConfigCreateEdit from "./complaintAssignConfig/addEditForm";
import ResolutionLanding from "./resolution/landing";

export function ComplainManagementPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/sales-management/complainmanagement"
        to="/sales-management/complainmanagement/complain"
      />
      <ContentRoute
        from="/sales-management/complainmanagement/complain/entry"
        component={ComplainForm}
      />
      <ContentRoute
        from="/sales-management/complainmanagement/complain/edit/:edit"
        component={ComplainForm}
      />
      <ContentRoute
        from="/sales-management/complainmanagement/complain/view/:view"
        component={ComplainForm}
      />
      <ContentRoute
        from="/sales-management/complainmanagement/complain"
        component={ComplainLanding}
      />{" "}
      <ContentRoute
        from="/sales-management/complainmanagement/Delegate"
        component={ResolutionLanding}
      />
      <ContentRoute
        from="/sales-management/complainmanagement/investigate"
        component={ResolutionLanding}
      />
      <ContentRoute
        from="/sales-management/complainmanagement/complaintassignconfig/create"
        component={ComplainAssignConfigCreateEdit}
      />
      <ContentRoute
        from="/sales-management/complainmanagement/complaintassignconfig/edit/:id"
        component={ComplainAssignConfigCreateEdit}
      />
      <ContentRoute
        from="/sales-management/complainmanagement/complaintassignconfig"
        component={ComplainAssignConfigLanding}
      />
    </Switch>
  );
}
