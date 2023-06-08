import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import CostSheetLanding from "../costReport/costSheet/landing";
import InventoryAgingLanding from "../report/inventoryAging/landing";
import { AccountPayableAnalysis } from "../report/accountPayableAnalysis/landing/form";
import { PartnerAccAnalysisLanding } from "../report/partnerAccAnalysis/landing/form";
import CostSheetRevisedLanding from "./costSheetRevised/landing";
import { ProfitCenterReport } from "../report/profitCenterReport/Form/addEditForm";
import { CashRegisterReport } from "../report/cashRegisterReport/Form/addEditForm";
import { FinencialRatiosAnalysis } from "../report/finencialRatiosAnalysis/Form/addEditForm";
import BudgetVsSalesVarient from "../../internalControl/budgetVSSalesVarient";

export function CostReportPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/financial-management/cost-report"
        to="/financial-management/cost-report/costsheet"
      />
      <ContentRoute
        path="/financial-management/cost-report/costsheet"
        component={CostSheetLanding}
      />
      <ContentRoute
        path="/financial-management/cost-report/costsheetrevised"
        component={CostSheetRevisedLanding}
      />

      {/* Inventory Analysis Report */}
      <ContentRoute
        path="/financial-management/cost-report/inventoryaging"
        component={InventoryAgingLanding}
      />
      <ContentRoute
        path="/financial-management/cost-report/payableaging"
        component={AccountPayableAnalysis}
      />
      <ContentRoute
        path="/financial-management/cost-report/receivableAging"
        component={PartnerAccAnalysisLanding}
      />
      <ContentRoute
        path="/financial-management/cost-report/profitCenterReport"
        component={ProfitCenterReport}
      />
      <ContentRoute
        path="/financial-management/cost-report/cashregister"
        component={CashRegisterReport}
      />
      <ContentRoute
        path="/financial-management/cost-report/finencialratiosanalysis"
        component={FinencialRatiosAnalysis}
      />
      <ContentRoute
        path="/financial-management/cost-report/BudgetVSSalesVariance"
        component={BudgetVsSalesVarient}
      />
    </Switch>
  );
}
