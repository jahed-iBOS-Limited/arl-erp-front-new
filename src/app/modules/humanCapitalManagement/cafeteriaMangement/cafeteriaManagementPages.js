import React from "react";
import { Switch, Redirect } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import { CafeteriaDetailsReport } from "./cafeteriaDetailsReport/Form/AddEditForm";
import { CafeteriaSummaryReport } from "./cafeteriaSummary/Form/AddEditForm";
import FoodCornerLanding from "./foodCorner/landing";

export function CafeteriaManagementPages() {

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/human-capital-management"
        to="/human-capital-management/cafeteriamgt"
      />

      {/* Food Corner */}
      <ContentRoute
        path="/human-capital-management/cafeteriamgt/mealentry"
        component={FoodCornerLanding}
      />

      {/* Cafeteria Summary Report */}
      <ContentRoute
        path="/human-capital-management/cafeteriamgt/mealsummary"
        component={CafeteriaSummaryReport}
      />

      {/* Cafeteria Details Report */}
      <ContentRoute
        path="/human-capital-management/cafeteriamgt/mealdetails"
        component={CafeteriaDetailsReport}
      />
    </Switch>
  );
}
