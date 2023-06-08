import React from "react";
import { Switch, Redirect } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import LoanForm from "./loanApplication/Form/AddEditForm";
import LoanApplication from "./loanApplication";

import LoanApprovalLanding from "./loanApprove";
import LoanRescheduleLanding from "./loanReschedule";
import LoanSummaryLanding from "./loanSummary";
import LoanScheduleLanding from "./loanSchedule";
// import LoanApproveForm from "./loanApprove/Form/AddEditForm";


export function LoanPages() {

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/human-capital-management"
        to="/human-capital-management/loan"
      />
      {/*LOAN APPLICATION PAGE ROUTING */}
      <ContentRoute
        path="/human-capital-management/loan/loanapplication/edit/:id/:applicationId"
        component={LoanForm}
      />
      <ContentRoute
        path="/human-capital-management/loan/loanapplication/create"
        component={LoanForm}
      />
      <ContentRoute
        path="/human-capital-management/loan/loanapplication"
        component={LoanApplication}
      />
      {/*LOAN RESCHEDULE PAGE ROUTING */}
      <ContentRoute
        path="/human-capital-management/loan/loanreschedule"
        component={LoanRescheduleLanding}
      />
      {/*LOAN RESCHEDULE PAGE ROUTING */}
      <ContentRoute
        path="/human-capital-management/loan/loanschedule"
        component={LoanScheduleLanding}
      />

      {/*LOAN Approve PAGE ROUTING */}
      <ContentRoute
        path="/human-capital-management/loan/loanapproval"
        component={LoanApprovalLanding}
      />
      <ContentRoute
        path="/human-capital-management/loan/loansummary"
        component={LoanSummaryLanding}
      />
    </Switch>
  );
}
