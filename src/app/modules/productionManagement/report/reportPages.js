import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import ItemOverallCost from "./ItemOverallCost";
import BomReportLanding from "./bomReport/landing/landing";
import CostSheetReportLanding from "./costSheetReport/landing/landing";
import HealthSummary from "./healthSummary";
import HealthCheckCondition from "./healthcheckCondition";
import OeeProductionSummary from "./oeeProductionSummary";
import OeeReport from "./oeeReport";
import PoStatusReportLanding from "./poStatusReport/landing/landing";
import ProductionReportLanding from "./productionReport/landing/landing";
import ProductionWiseRMConjunctionReport from "./productionWiseRMConjunctionReport";
import ShopFloorIssueReportLanding from './shopFloorIssueReport/landing/landing';
import StockReportLanding from "./stockReport/landing/landing";
import TransferedItemReportLanding from "./transferedItemReport/landing/landing";
import YeildReport from "./yeildReport";
import Yeildreport from "./yeildReportNew";
import ProductionDataLanding from "./productionData/landing/landing";

export function MesReportPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/production-management/mes"
        to="/production-management/mes/report"
      />
      {/* Production Report */}
      <ContentRoute
        path="/production-management/report/productionreport"
        component={ProductionReportLanding}
      />
      {/* Stock Report */}
      <ContentRoute
        path="/production-management/report/stockReport"
        component={StockReportLanding}
      />

      {/* Cost Sheet Report */}
      <ContentRoute
        path="/production-management/report/costSheetReport"
        component={CostSheetReportLanding}
      />

      {/* Item Overall Report */}
      <ContentRoute
        path="/production-management/report/ItemOverallCost"
        component={ItemOverallCost}
      />

      {/* Production wise RM Conjunction */}
      <ContentRoute
        path="/production-management/report/ProductionWiseRMConjunction"
        component={ProductionWiseRMConjunctionReport}
      />
      <ContentRoute
        path="/production-management/report/yeildreport"
        component={
          Yeildreport
        }
      />
      <ContentRoute
        path="/production-management/report/HealthcheckCondition"
        component={HealthCheckCondition}
      />
       <ContentRoute
        path="/production-management/report/HealthSummary"
        component={HealthSummary}
      />

      {/* OEE Report (BI) */}
      <ContentRoute
        path="/production-management/report/OEEReport"
        component={
          OeeReport
        }
      />

      {/* BOM Report */}
      <ContentRoute
        path="/production-management/report/bomReport"
        component={BomReportLanding}
      />

      {/* PO Status Report */}
      <ContentRoute
        path="/production-management/report/poStatusReport"
        component={PoStatusReportLanding}
      />

      {/* Transfered Item Report */}
      <ContentRoute
        path="/production-management/report/transferedItemReport"
        component={TransferedItemReportLanding}
      />
      {/* Transfered Item Report */}
      <ContentRoute
        path="/production-management/report/shopfloorIssueReport"
        component={ShopFloorIssueReportLanding}
      />
      <ContentRoute
        path="/production-management/report/demoYeildReport"
        component={YeildReport}
      />
      <ContentRoute
        path="/production-management/report/OEEProductionSummary"
        component={OeeProductionSummary}
      />
        <ContentRoute
        path="/production-management/report/ProductionData"
        component={ProductionDataLanding}
      />
    </Switch>
  );
}
