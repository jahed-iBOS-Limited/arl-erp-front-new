import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import EventPlanningLanding from "./eventPlanning";
import EventPlanningCreateEdit from "./eventPlanning/createEdit";

export function EventPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  for (let i = 0; i < userRole.length; i++) {
    // if (userRole[i]?.intFeatureId === 1131) {
    //   trainingAttendence = userRole[i];
    // }
  }

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/learningDevelopment"
        to="/learningDevelopment/event/EventPlanning"
      />
      <ContentRoute
        path="/learningDevelopment/event/EventPlanning/edit/:id"
        component={EventPlanningCreateEdit}
      />
      <ContentRoute
        path="/learningDevelopment/event/EventPlanning/create"
        component={EventPlanningCreateEdit}
      />
      <ContentRoute
        path="/learningDevelopment/event/EventPlanning"
        component={EventPlanningLanding}
      />
    </Switch>
  );
}
