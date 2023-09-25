import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import BudgetVsSalesVarient from "./salesBudgetVarianceReport";


const BudgetVarianceReportPages = () => {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/internal-control/budgetvariancereport"
        to="/internal-control/budgetvariancereport/BudgetVSSalesVariance"
      />
      <ContentRoute
        path="/internal-control/budgetvariancereport/BudgetVSSalesVariance"
        component={BudgetVsSalesVarient}
      />
      
    </Switch>
  );
};

export default BudgetVarianceReportPages;
