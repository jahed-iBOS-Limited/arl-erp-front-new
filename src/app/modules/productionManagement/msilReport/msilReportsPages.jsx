import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import BreakDownReportRDLC from "./breakDownReport(RDLC)/form";
import ElectricalDashboardReport from "./ElecctricalDashboard(BI)/landing/form";
import GateItemEntryRDLC from "./gateItemEntry(RDLC)/form";
import GateOutByDeliveryChallanRDLC from "./gateOutByDeliveryChallan(RDLC)/form";
import KeyRegisterReportRDLC from "./keyRegisterReport(RDLC)/form";
import LabourInOutReportRDLC from "./labourInOutReport(RDLC)/form";
import MedicalReportRDLC from "./medicalReport(RDLC)/form";
import MeltingChemicalCompositionReportRDLC from "./meltingChemicalCompositionReport(RDLC)/form";
import MeltingDashboardReport from "./MeltingDashboard(BI)/landing/form";
import MeltingProductionRDLC from "./meltingProduction(RDLC)/form";
import MeltingScrapUsedReportRDLC from "./meltingScrapUsedReport(RDLC)/form";
import MeltingScrapUsedSummaryReportRDLC from "./meltingScrapUsedSummaryReport(RDLC)/form";
import MeltingYieldScrapReportRDLC from "./meltingYieldScrapReport(RDLC)/form";
import MSILElectricalReportRDLC from "./msilElectricalReport(RDLC)/form";
import PreRawMaterialDashboardReport from "./PreRawMaterialDashboard(BI)/landing/form";
import PreRawMaterialReceiveReportRDLC from "./preRawMaterialReceive(RDLC)/form";
import PreRawMaterialReceiveTruckWiseReportRDLC from "./preRawMaterialReceiveTruckWise(RDLC)/form";
import ProductionBreakdownReport from "./ProductionBreakdownDashboard/landing/form";
import RentalVehicalEntryExitRDLC from "./rentalVehicalEntryExit(RDLC)/form";
import RollingProductionAndWastageReportRDLC from "./rollingProductionAndWastageReport(RDLC)/form";
import RollingProductionNWastageDashboardReport from "./RollingProductionNWastageDashboard(BI)/landing/form";
import RollingQualityMainReportRDLC from "./rollingQualityMainReport(RDLC)/form";
import RollingQualitySubReportRDLC from "./rollingQualitySubReport(RDLC)/form";
import ScaleRepot from "./scaleReport";
import SecurityPostAssaignRDLC from "./securityPostAssaignReport(RDLC)/form";
import VisitorReportRDLC from "./visitorReport(RDLC)/form";

export default function MSILReportsPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/production-management"
        to="/production-management/msil-report"
      />
      <ContentRoute
        path="/production-management/msil-report/Electrical-Dashboard"
        component={ElectricalDashboardReport}
      />
      <ContentRoute
        path="/production-management/msil-report/Melting-Dashboard"
        component={MeltingDashboardReport}
      />
      <ContentRoute
        path="/production-management/msil-report/Pre-Raw-Material-Receive-Dashboard"
        component={PreRawMaterialDashboardReport}
      />
      <ContentRoute
        path="/production-management/msil-report/Production-Breakdown-Dashboard"
        component={ProductionBreakdownReport}
      />
      <ContentRoute
        path="/production-management/msil-report/Rolling-Production-and-Wastage-Dashboard"
        component={RollingProductionNWastageDashboardReport}
      />
      <ContentRoute
        path="/production-management/msil-report/Breakdown-Report"
        component={BreakDownReportRDLC}
      />
      <ContentRoute
        path="/production-management/msil-report/Melting-Chemical-Composition-Report"
        component={MeltingChemicalCompositionReportRDLC}
      />
      <ContentRoute
        path="/production-management/msil-report/Melting-Production"
        component={MeltingProductionRDLC}
      />
      <ContentRoute
        path="/production-management/msil-report/Melting-Scrap-Used-Report"
        component={MeltingScrapUsedReportRDLC}
      />
      <ContentRoute
        path="/production-management/msil-report/Melting-Scrap-Used-Summary-Report"
        component={MeltingScrapUsedSummaryReportRDLC}
      />
      <ContentRoute
        path="/production-management/msil-report/Melting-Yield-Scrap-Report"
        component={MeltingYieldScrapReportRDLC}
      />
      <ContentRoute
        path="/production-management/msil-report/MSIL-Electrical-Report"
        component={MSILElectricalReportRDLC}
      />
      <ContentRoute
        path="/production-management/msil-report/Pre-Raw-Material-Receive"
        component={PreRawMaterialReceiveReportRDLC}
      />
      <ContentRoute
        path="/production-management/msil-report/Pre-Raw-Material-Receive-Truck-Wise"
        component={PreRawMaterialReceiveTruckWiseReportRDLC}
      />
      <ContentRoute
        path="/production-management/msil-report/Rolling-Production-and-Wastage-Report"
        component={RollingProductionAndWastageReportRDLC}
      />
      <ContentRoute
        path="/production-management/msil-report/Scale-Report"
        component={ScaleRepot}
      />
      <ContentRoute
        path="/production-management/msil-report/Gate-Item-Entry"
        component={GateItemEntryRDLC}
      />
      <ContentRoute
        path="/production-management/msil-report/Rollin-Quality-Main-Report"
        component={RollingQualityMainReportRDLC}
      />
      <ContentRoute
        path="/production-management/msil-report/Rolling-Quality-Sub-Report"
        component={RollingQualitySubReportRDLC}
      />
      <ContentRoute
        path="/production-management/msil-report/Gate-Out-By-Delivery-Challan"
        component={GateOutByDeliveryChallanRDLC}
      />
      <ContentRoute
        path="/production-management/msil-report/Rented-Vehicle-Register"
        component={RentalVehicalEntryExitRDLC}
      />
      <ContentRoute
        path="/production-management/msil-report/Key-Register"
        component={KeyRegisterReportRDLC}
      />
      <ContentRoute
        path="/production-management/msil-report/Visitor-Register"
        component={VisitorReportRDLC}
      />
      <ContentRoute
        path="/production-management/msil-report/Security-Post-Assign"
        component={SecurityPostAssaignRDLC}
      />
      <ContentRoute
        path="/production-management/msil-report/Contractor-Labour-Register"
        component={LabourInOutReportRDLC}
      />
      <ContentRoute
        path="/production-management/msil-report/Medical-Register"
        component={MedicalReportRDLC}
      />
    </Switch>
  );
}
