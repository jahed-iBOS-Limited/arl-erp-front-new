import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import AssessmentForm from "./assessmentForm";
import AssessmentSubmissionForm from "./assessmentForm/create/create";
import AssessmentFormCreateEdit from "./assessmentForm/createEdit";
import Submissions from "./assessmentForm/submission";

export function AssessmentPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let assesmentForm = null;
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1132) {
      assesmentForm = userRole[i];
    }
  }
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/learningDevelopment"
        to="/learningDevelopment/assessment"
      />
      <ContentRoute
        path="/learningDevelopment/assessment/assessmentForm/submission/:id"
        component={assesmentForm?.isView ? Submissions : NotPermittedPage}
      />
      <ContentRoute
        path="/learningDevelopment/assessment/assessmentForm/view/:viewId"
        component={assesmentForm?.isView ? AssessmentSubmissionForm : NotPermittedPage}
      />
      <ContentRoute
        path="/learningDevelopment/assessment/assessmentForm/edit/:id"
        component={assesmentForm?.isCreate ? AssessmentFormCreateEdit : NotPermittedPage}
      />
      <ContentRoute
        path="/learningDevelopment/assessment/assessmentForm"
        component={assesmentForm?.isView ? AssessmentForm : NotPermittedPage}
      />
    </Switch>
  );
}
