import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import ProjectAccounting from ".";
import ProjectAccountingCreate from "./projectAccounting";
import ProjectAccountingComplete from "./ProjectAccountingComplete";
import ProjectStatus from "../projectStatus";
import { shallowEqual, useSelector } from "react-redux";
import NotPermitted from "../../performanceManagement/notPermittedPage/notPermitted";
const ProjectAccountingPages = () => {

  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let projectStatusPermission = null;
 
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1386) {
      projectStatusPermission = userRole[i];
    }
  }
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/financial-management/projectAccounting"
        to="/financial-management/projectAccounting/projectAccounting"
      />
      <ContentRoute
        from="/financial-management/projectAccounting/projectAccounting/complete"
        component={ProjectAccountingComplete}
      />
      <ContentRoute
        from="/financial-management/projectAccounting/projectAccounting/create"
        component={ProjectAccountingCreate}
      />
      <ContentRoute
        from="/financial-management/projectAccounting/projectAccounting/edit"
        component={ProjectAccountingCreate}
      />
      <ContentRoute
        from="/financial-management/projectAccounting/projectAccounting"
        component={ProjectAccounting}
      />
       <ContentRoute
        from="/financial-management/projectAccounting/ProjectStatus"
        component={projectStatusPermission?.isView ? ProjectStatus : NotPermitted}
      />
    </Switch>
  );
};

export default ProjectAccountingPages;
