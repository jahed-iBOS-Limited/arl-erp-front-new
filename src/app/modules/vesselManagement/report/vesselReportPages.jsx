import React from "react";
import { Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import DayByDayUnloadAndDelivery from "./BIReports/dayByDay";
import DeliveryReportRDLC from "./BIReports/delivery";
import InventoryG2GReportRDLC from "./BIReports/inventory";
import StockAnalysis from "./BIReports/stockAnalysis";
import TimeSheetReport from "./BIReports/timeSheet";
import MotherVesselCostInfo from "./motherVesselCostInfo/landing/table";
import VesselCostInfo from "./vesselCostInfo/landing";

export default function ReportPages() {
  return (
    <Switch>
      <ContentRoute
        path="/vessel-management/report/delivery"
        component={DeliveryReportRDLC}
      />
      <ContentRoute
        path="/vessel-management/report/g2ginventory"
        component={InventoryG2GReportRDLC}
      />
      <ContentRoute
        path="/vessel-management/report/timesheet"
        component={TimeSheetReport}
      />
      <ContentRoute
        path="/vessel-management/report/daybydayunloadndelivery"
        component={DayByDayUnloadAndDelivery}
      />
      <ContentRoute
        path="/vessel-management/report/stockanalysis"
        component={StockAnalysis}
      />
      <ContentRoute
        path="/vessel-management/report/mothervesselcostinfo"
        component={MotherVesselCostInfo}
      />
      <ContentRoute
        path="/vessel-management/report/vesselcostinfo"
        component={VesselCostInfo}
      />
    </Switch>
  );
}
