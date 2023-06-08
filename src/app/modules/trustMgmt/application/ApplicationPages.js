import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Switch, Redirect } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import ApplicationEntryForm from "./entryForm/Form/addEditForm";

export function ApplicationPages() {
  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let trustEntry = null;
  userRole.forEach((item) => {
    if (item?.intFeatureId === 967) {
      trustEntry = item;
    }
  });

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/trustmgmt/application"
        to="/trustmgmt/application/entryForm"
      />

      <ContentRoute
        path="/trustmgmt/application/entryForm"
        component={
          trustEntry?.isCreate ? ApplicationEntryForm : NotPermittedPage
        }
      />
    </Switch>
  );
}
