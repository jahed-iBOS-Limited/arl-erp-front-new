import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import NotPermittedPage from "../_helper/notPermitted/NotPermittedPage";
import { Addjustment } from "./addjustment";
import BallastPassageForm from "./ballastPassage/ballastPassage/Form/addEditForm";
import BallastPassageLanding from "./ballastPassage/ballastPassage/table/table";
import BunkerCostForm from "./bunker/bunkerCost/Form/addEditForm";
import BunkerCostTable from "./bunker/bunkerCost/table/table";
import BunkerInfoForm from "./bunker/bunkerInformation/form/addEditForm";
import BunkerInfoTable from "./bunker/bunkerInformation/table/table";
import BunkerInventoryTable from "./bunker/bunkerInventory/table/table";
import PurchaseBunkerForm from "./bunker/purchaseBunker/form/addEditForm";
import PurchaseBunkerTable from "./bunker/purchaseBunker/table/table";
import CertificateManagementForm from "./certificateManagement/certificateManagement/Form/addEditForm";
import CertificateManagementTable from "./certificateManagement/certificateManagement/table/table";
import { CharteringContext, CharteringState } from "./charteringContext";
import BusinessPartnerForm from "./configuration/businessPartner/Form/addEditForm";
import BusinessPartnerTable from "./configuration/businessPartner/table/table";
import CargoForm from "./configuration/cargo/Form/addEditForm";
import CargoTable from "./configuration/cargo/table/table";
import CertificateNameForm from "./configuration/certificate/Form/addEditForm";
import CertificateNameTable from "./configuration/certificate/table/table";
import PortForm from "./configuration/port/Form/addEditForm";
import PortTable from "./configuration/port/table/table";
import VesselForm from "./configuration/vessel/Form/addEditForm";
import VesselTable from "./configuration/vessel/table/table";
import ExpenseForm from "./expense/expense/Form/addEditForm";
import ExpenseTable from "./expense/expense/table/table";
import LayTimeForm from "./layTime/Form/addEditForm";
import LighterVesselPages from "./lighterVessel/lighterVesselPages";
import NextBunkerInfoForm from "./next/shared/bunkerInformation/form/addEditForm";
import NextExpenseForm from "./next/shared/expense/Form/addEditForm";
import NextBallastPassageForm from "./next/timeCharter/ballastPassage/Form/addEditForm";
import NextOffHireForm from "./next/timeCharter/offHire/Form/addEditForm";
import NextBunkerCostForm from "./next/voyageCharter/bunkerCost/Form/addEditForm";
import OffHireForm from "./offHire/Form/addEditForm";
import OffHireTable from "./offHire/table/table";
import AdjustmentReport from "./reports/adjustmentReport";
import CertificateManagementReport from "./reports/certificateManagementReport";
import CharterPartyClauseForm from "./reports/cpClause/Form/addEditForm";
import ReportTabs from "./reports/incomeReport/table";
// import CPTable from "./reports/cpClause/table/table";
import VoyageSummary from "./reports/voyageSummary/table/table";
import "./style.css";
import StatementTable from "./transaction/statement/table/table";
import TimeCharterForm from "./transaction/timeCharter/Form/addEditForm";
import TimeCharterTable from "./transaction/timeCharter/table/table";
import VoyageCharterForm from "./transaction/voyageCharter/Form/addEditForm";
import VoyageCharterTable from "./transaction/voyageCharter/table/table";
import VoyageForm from "./voyage/Form/addEditForm";
import ShipperLandingAndForm from "./voyage/shipper/table/table";
import VoyageTable from "./voyage/table/table";
import { VoyageChecklist } from "./voyageChecklist";
import { VoyageChecklistDetails } from "./voyageChecklist/components/voyageChecklistDetails";
import PortDistanceReport from "./reports/portDistance";
import VesselAuditLanding from "./vesselAuditInspection";
import CreateEditVesselAudit from "./vesselAuditInspection/components/CreateEditVesselAudit";
import ManagementDashboard from "./reports/managementDashboard";
import OperationPages from "./operation/operationPages";

export function CharteringPages() {
  const [state, setState] = useState(CharteringState);
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let adjustmentPermission = null;
  let voyageChecklistPermissions = null;
  let certificateManagementPermission = null;
  let certificateCreatePermission = null;
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 977) {
      adjustmentPermission = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 976) {
      voyageChecklistPermissions = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 978) {
      certificateManagementPermission = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 979) {
      certificateCreatePermission = userRole[i];
    }
  }

  return (
    <CharteringContext.Provider value={[state, setState]}>
      <Switch>
        <Redirect
          exact={true}
          from="/chartering"
          to="/chartering/report/voyageSummary"
        />
        {/* Voyage */}
        <Route
          path="/chartering/voyage/shipper/:id"
          component={ShipperLandingAndForm}
        />
        <Route path="/chartering/voyage/:type/:id" component={VoyageForm} />
        <Route path="/chartering/voyage/create" component={VoyageForm} />
        <Route path="/chartering/voyage" component={VoyageTable} />
        {/* purchase bunker */}
        <Route
          path="/chartering/bunker/purchaseBunker/:type/:id"
          component={PurchaseBunkerForm}
        />
        <Route
          path="/chartering/bunker/purchaseBunker/create"
          component={PurchaseBunkerForm}
        />
        <Route
          path="/chartering/bunker/purchaseBunker"
          component={PurchaseBunkerTable}
        />
        {/* bunker information */}
        <Route
          path="/chartering/bunker/bunkerInformation/:type/:id"
          component={BunkerInfoForm}
        />
        <Route
          path="/chartering/bunker/bunkerInformation/create"
          component={BunkerInfoForm}
        />
        {/* <Route
          path="/chartering/bunker/bunkerInformation/bodEntry"
          component={BODEntryForm}
        /> */}
        <Route
          path="/chartering/bunker/bunkerInformation"
          component={BunkerInfoTable}
        />
        {/* Off Hire */}
        <Route path="/chartering/offHire/:type/:id" component={OffHireForm} />
        <Route path="/chartering/offHire/create" component={OffHireForm} />
        <Route path="/chartering/offHire" component={OffHireTable} />
        {/* Time Charter Transaction */}
        <Route
          path="/chartering/transaction/timecharter/:type/:id"
          component={TimeCharterForm}
        />
        <Route
          path="/chartering/transaction/timecharter/create"
          component={TimeCharterForm}
        />
        <Route
          path="/chartering/transaction/timecharter"
          component={TimeCharterTable}
        />
        {/* Voyage Charter Transaction */}
        <Route
          path="/chartering/transaction/voyagecharter/:type/:id"
          component={VoyageCharterForm}
        />
        <Route
          path="/chartering/transaction/voyagecharter/create"
          component={VoyageCharterForm}
        />
        <Route
          path="/chartering/transaction/voyagecharter"
          component={VoyageCharterTable}
        />
        {/* bunker inventory */}
        <Route
          path="/chartering/bunker/bunkerInventory"
          component={BunkerInventoryTable}
        />
        {/* bunker cost */}
        <Route
          path="/chartering/bunker/bunkerCost/:type/:id"
          component={BunkerCostForm}
        />
        <Route
          path="/chartering/bunker/bunkerCost/create"
          component={BunkerCostForm}
        />
        <Route
          path="/chartering/bunker/bunkerCost"
          component={BunkerCostTable}
        />
        {/* statement */}
        <Route
          path="/chartering/transaction/statement"
          component={StatementTable}
        />
        <Route
          path="/chartering/voyageChecklist/voyageChecklist/details"
          component={
            voyageChecklistPermissions?.isCreate ||
            voyageChecklistPermissions?.isEdit
              ? VoyageChecklistDetails
              : NotPermittedPage
          }
        />
        <Route
          path="/chartering/voyageChecklist/voyageChecklist"
          component={
            voyageChecklistPermissions?.isView
              ? VoyageChecklist
              : NotPermittedPage
          }
        />
        <Route
          path="/chartering/adjustment/adjustment"
          component={
            adjustmentPermission?.isView ||
            adjustmentPermission?.isEdit ||
            adjustmentPermission?.isCreate
              ? Addjustment
              : NotPermittedPage
          }
        />
        {/* Lay Time*/}
        <Route path="/chartering/layTime/layTime" component={LayTimeForm} />
        {/* Expense */}
        <Route
          path="/chartering/expense/expense/:type/:id"
          component={ExpenseForm}
        />
        <Route
          path="/chartering/expense/expense/create"
          component={ExpenseForm}
        />
        <Route path="/chartering/expense/expense" component={ExpenseTable} />
        {/* Ballast Passage */}
        <Route
          path="/chartering/ballastPassage/ballastPassage/:type/:id"
          component={BallastPassageForm}
        />
        <Route
          path="/chartering/ballastPassage/ballastPassage/create"
          component={BallastPassageForm}
        />
        <Route
          path="/chartering/ballastPassage/ballastPassage"
          component={BallastPassageLanding}
        />
        {/* Next Pages Route */}
        <Route
          path="/chartering/next/bunkerInformation"
          component={NextBunkerInfoForm}
        />
        <Route
          path="/chartering/next/ballastPassage"
          component={NextBallastPassageForm}
        />
        <Route
          path="/chartering/next/bunkerCost"
          component={NextBunkerCostForm}
        />
        <Route path="/chartering/next/expense" component={NextExpenseForm} />
        <Route path="/chartering/next/offHire" component={NextOffHireForm} />
        {/* ======== Certificate Management ====== */}
        <Route
          path="/chartering/certificateManagement/certificateManagement/:type/:id"
          component={CertificateManagementForm}
        />
        <Route
          path="/chartering/certificateManagement/certificateManagement/create"
          component={
            certificateManagementPermission?.isCreate
              ? CertificateManagementForm
              : NotPermittedPage
          }
        />
        <Route
          path="/chartering/certificateManagement/certificateManagement"
          component={
            certificateManagementPermission?.isView
              ? CertificateManagementTable
              : NotPermittedPage
          }
        />

        <Route
          path="/chartering/certificateManagement/vesselAuditInspection/:type/:id"
          component={CreateEditVesselAudit}
        />
        <Route
          path="/chartering/certificateManagement/vesselAuditInspection/create"
          component={CreateEditVesselAudit}
        />
        <Route
          path="/chartering/certificateManagement/vesselAuditInspection"
          component={VesselAuditLanding}
        />
        {/* ======== Configuration ====== */}
        {/* Stakeholder */}
        <Route
          path="/chartering/configuration/stakeholder/:type/:id"
          component={BusinessPartnerForm}
        />
        <Route
          path="/chartering/configuration/stakeholder/create"
          component={BusinessPartnerForm}
        />
        <Route
          path="/chartering/configuration/stakeholder"
          component={BusinessPartnerTable}
        />
        {/* Vessel */}
        <Route
          path="/chartering/configuration/vessel/:type/:id"
          component={VesselForm}
        />
        <Route
          path="/chartering/configuration/vessel/create"
          component={VesselForm}
        />
        <Route
          path="/chartering/configuration/vessel"
          component={VesselTable}
        />
        {/* Port */}
        <Route
          path="/chartering/configuration/port/:type/:id"
          component={PortForm}
        />
        <Route
          path="/chartering/configuration/port/create"
          component={PortForm}
        />
        <Route path="/chartering/configuration/port" component={PortTable} />
        {/* Cargo */}
        <Route
          path="/chartering/configuration/cargo/:type/:id"
          component={CargoForm}
        />
        <Route
          path="/chartering/configuration/cargo/create"
          component={CargoForm}
        />
        <Route path="/chartering/configuration/cargo" component={CargoTable} />
        {/* Certificate */}
        <Route
          path="/chartering/configuration/certificate/:type/:id"
          component={CertificateNameForm}
        />
        <Route
          path="/chartering/configuration/certificate/create"
          component={
            certificateCreatePermission?.isCreate
              ? CertificateNameForm
              : NotPermittedPage
          }
        />
        <Route
          path="/chartering/configuration/certificate"
          component={
            certificateCreatePermission?.isView
              ? CertificateNameTable
              : NotPermittedPage
          }
        />
        {/* ======== Configuration ====== */}
        {/* ======== Reports ======== */}
        {/* Voyage Summary Report */}
        <Route
          path="/chartering/report/voyageSummary"
          component={VoyageSummary}
        />
        <Route
          path="/chartering/report/outstandingAdjustment"
          component={AdjustmentReport}
        />
        <Route
          path="/chartering/report/certificateDue"
          component={CertificateManagementReport}
        />
        <Route
          path="/chartering/report/PortDistance"
          component={PortDistanceReport}
        />
        <Route
          path="/chartering/report/managementDashboard"
          component={ManagementDashboard}
        />

        {/* ======== Reports ======== */}
        {/* ======== 🚢🚢 Lighter Vessel Pages 🚢🚢 ======== */}
        <Route
          path="/chartering/lighterVessel"
          component={LighterVesselPages}
        />
         <Route
          path="/chartering/operation"
          component={OperationPages}
        />
        <Route
          path="/chartering/report/cpClause/:type/:id"
          component={CharterPartyClauseForm}
        />
        <Route
          path="/chartering/report/cpClause/create"
          component={CharterPartyClauseForm}
        />
        <Route path="/chartering/report/incomeReport" component={ReportTabs} />
        {/* <Route path="/chartering/report/cpClause" component={CPTable} /> */}
      </Switch>
    </CharteringContext.Provider>
  );
}
export default CharteringPages;
