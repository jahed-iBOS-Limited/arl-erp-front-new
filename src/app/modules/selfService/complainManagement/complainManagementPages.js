import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import ComplainForm from "./complain/form/addEditForm";
import ComplainLanding from "./complain/landing";
import ResolutionLanding from "./resolution/landing";

export function ComplainManagementPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/self-service/complainmanagement"
        to="/self-service/complainmanagement/complain"
      />
      <ContentRoute
        from="/self-service/complainmanagement/complain/entry"
        component={ComplainForm}
      />
      <ContentRoute
        from="/self-service/complainmanagement/complain/edit/:edit"
        component={ComplainForm}
      />
      <ContentRoute
        from="/self-service/complainmanagement/complain/view/:view"
        component={ComplainForm}
      />
      <ContentRoute
        from="/self-service/complainmanagement/complain"
        component={ComplainLanding}
      />{" "}
      <ContentRoute
        from="/self-service/complainmanagement/Delegate"
        component={ResolutionLanding}
      />
      <ContentRoute
        from="/self-service/complainmanagement/investigate"
        component={ResolutionLanding}
      />
    </Switch>
  );
}
