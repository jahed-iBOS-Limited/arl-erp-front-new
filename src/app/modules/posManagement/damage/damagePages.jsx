import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { Suspense } from "react";
import DamageEntryForm from "./form/addEditForm"
import DamageEntryLanding from "./landing/table"


export function DamagePages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact
          from="/pos-management"
          to="/pos-management/damage/damage-entry"
        />
        <ContentRoute
          exact
          path="/pos-management/damage/damage-entry/edit/:id"
          component={DamageEntryForm}
        />
        <ContentRoute
          exact
          path="/pos-management/damage/damage-entry/create"
          component={DamageEntryForm}
        />

        <ContentRoute
          exact
          path="/pos-management/damage/damage-entry"
          component={DamageEntryLanding}
        />
      </Switch>
    </Suspense>
  );
}

export default DamagePages;
