import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import CostOfProductionReport from "./costProductionReport";
import MaterialConsumptionVarianceReport from "./materialConsumptionReport";
import ProductionVarianceReport from "./productionVarianceReport";
import BudgetVsSalesVarient from "./salesBudgetVarianceReport";


const BudgetVarianceReportPages = () => {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/internal-control/budgetvariancereport"
        to="/internal-control/budgetvariancereport/BudgetVSSalesVariance"
      />
      {/* <ContentRoute
        path="/internal-control/budgetvariancereport/BudgetVSSalesVariance/test"
        component={BudgetVarianceReport}
      /> */}
      <ContentRoute
        path="/internal-control/budgetvariancereport/BudgetVSSalesVariance"
        component={BudgetVsSalesVarient}
      />
      <ContentRoute
        path="/internal-control/budgetvariancereport/productvariancereport"
        component={ProductionVarianceReport}
      />
      <ContentRoute
        path="/internal-control/budgetvariancereport/costofproductionreport"
        component={CostOfProductionReport}
      />
      <ContentRoute
        path="/internal-control/budgetvariancereport/materialconsumptionreport"
        component={MaterialConsumptionVarianceReport}
      />
      
    </Switch>
  );
};

export default BudgetVarianceReportPages;
