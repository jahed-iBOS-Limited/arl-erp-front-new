import React from "react";
import { Switch, Redirect } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import AddEditCircularForm from "./addCircular/Form/AddEditForm";
import OnBoardLanding from "./onBoard";
import RegisteredUsersLanding from "./registeredUsers/Table/TableHeader";
import ViewCandidates from "./viewCandidates/Table/TableHeader";
// AddNewCircular
// import LoanApproveForm from "./loanApprove/Form/AddEditForm";

export function JobCircularPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/human-capital-management/jobcircular"
        to="/human-capital-management/jobcircular/onboarding"
      />

      {/*LOAN RESCHEDULE PAGE ROUTING */}
      <ContentRoute
        path="/human-capital-management/jobcircular/onboarding"
        component={OnBoardLanding}
      />

      {/*JOB CIRCULAR PAGE ROUTING */}
      <ContentRoute
        path="/human-capital-management/jobcircular/add-new-circular"
        component={AddEditCircularForm}
      />

      <ContentRoute
        path="/human-capital-management/jobcircular/edit-circular/:id"
        component={AddEditCircularForm}
      />

      <ContentRoute
        path="/human-capital-management/jobcircular/registered-user"
        component={RegisteredUsersLanding}
      />

      <ContentRoute
        path="/human-capital-management/jobcircular/viewCandidates/:id"
        component={ViewCandidates}
      />
      {/*  */}
    </Switch>
  );
}
