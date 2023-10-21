import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { Suspense } from "react";
import { ContentRoute, LayoutSplashScreen } from "../../../_metronic/layout";
import { TrainingPages } from "./training/trainingPages";
import { AssessmentPages } from "./assessment/assessmentPages";
import { EventPages } from "./event/eventPages";

export function LearningAndDevelopmentPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <div className="hcm-module">
        <Switch>
          <Redirect
            exact={true}
            from="/learningDevelopment"
            to="/learningDevelopment/training/schedule"
          />
          <ContentRoute
            path="/learningDevelopment/training"
            component={TrainingPages}
          />
          <ContentRoute
            path="/learningDevelopment/assessment"
            component={AssessmentPages}
          />
          <ContentRoute
            path="/learningDevelopment/event"
            component={EventPages}
          />
        </Switch>
      </div>
    </Suspense>
  );
}

export default LearningAndDevelopmentPages;
