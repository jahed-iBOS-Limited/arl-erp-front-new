import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import CostOfProductionReport from "./costProductionReport";
import DistributionQtyVariance from "./distributionQtyVarianceReport";
import DistributionRateVariance from "./distributionRateVarianceReport";
import { IncomeStatementReport } from "./incomeStatementReport";
import MaterialConsumptionVarianceReport from "./materialConsumptionReport";
import MaterialPriceVariance from "./metarialPriceVariance";
import ProductionVarianceReport from "./productionVarianceReport";
import BudgetVsSalesVarient from "./salesBudgetVarianceReport";
import WorkingCapitalVarianceReport from "./workingCapitalVarianceReport";
import InventoryVarianceReport from "./workingVarianceReport";


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
        path="/internal-control/budgetvariancereport/incomestatementreport"
        component={IncomeStatementReport}
      />
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
      <ContentRoute
        path="/internal-control/budgetvariancereport/materialpricereport"
        component={MaterialPriceVariance}
      />
      <ContentRoute
        path="/internal-control/budgetvariancereport/distributionvariancereport"
        component={DistributionQtyVariance}
      />
      <ContentRoute
        path="/internal-control/budgetvariancereport/distributionratereport"
        component={DistributionRateVariance}
      />
      <ContentRoute
        path="/internal-control/budgetvariancereport/workingcapitalreport"
        component={WorkingCapitalVarianceReport}
      />
      <ContentRoute
        path="/internal-control/budgetvariancereport/inventoryvariancereport"
        component={InventoryVarianceReport}
      />
      
    </Switch>
  );
};

export default BudgetVarianceReportPages;
