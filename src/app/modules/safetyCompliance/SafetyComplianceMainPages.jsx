import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../_metronic/layout";
import { NestedSfPages } from "./NestedSfPages";

export function SafetyComplianceMainPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/safety-compliance"
        to="/safety-compliance/nestedsf/legal-document-name"
      />

      <ContentRoute
        path="/safety-compliance/nestedsf"
        component={NestedSfPages}
      />
    </Switch>
  );
}
export default SafetyComplianceMainPages;
