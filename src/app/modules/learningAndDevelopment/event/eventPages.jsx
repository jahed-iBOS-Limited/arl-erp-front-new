import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import EventPlanningLanding from "./eventPlanning";
import EventPlanningCreateEdit from "./eventPlanning/createEdit";
import ViewEventDetails from "./eventPlanning/view";
import Punch from "./eventPlanning/punch";
import NotPermitted from "../../performanceManagement/notPermittedPage/notPermitted";

export function EventPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let eventPermission = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1368) {
      eventPermission = userRole[i];
    }
  }

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/learningDevelopment"
        to="/learningDevelopment/event/EventPlanning"
      />
      <ContentRoute
        path="/learningDevelopment/event/EventPlanning/view/:id/punch/:activityId"
        component={eventPermission?.isEdit ? Punch : NotPermitted}
      />
      <ContentRoute
        path="/learningDevelopment/event/EventPlanning/view/:id"
        component={eventPermission?.isEdit ? ViewEventDetails : NotPermitted}
      />
      <ContentRoute
        path="/learningDevelopment/event/EventPlanning/edit/:id"
        component={
          eventPermission?.isEdit ? EventPlanningCreateEdit : NotPermitted
        }
      />
      <ContentRoute
        path="/learningDevelopment/event/EventPlanning/create"
        component={
          eventPermission?.isCreate ? EventPlanningCreateEdit : NotPermitted
        }
      />
      <ContentRoute
        path="/learningDevelopment/event/EventPlanning"
        component={
          eventPermission?.isView ? EventPlanningLanding : NotPermitted
        }
      />
    </Switch>
  );
}
