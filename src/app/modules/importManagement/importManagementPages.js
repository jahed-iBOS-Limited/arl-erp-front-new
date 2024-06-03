import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../_metronic/layout";
import CnFDetails from "./reports/CnFDetails/landing/tableHeader";
import ItemWiseStock from "./reports/ItemWiseStock/landing/tableHeader";
import LcCostSheetPartnerWise from "./reports/LcCostSheetPartnerWise";
import CnfPaymentDetails from "./reports/cnfDetailsReport/landing/tableHeader";
import CostSummary from "./reports/costSummary/landing/tableHeader";
import DocumentRelease from "./reports/documentRelease/landing/tableHeader";
import DutySummary from "./reports/dutySummary/landing/tableHeader";
import FundRequisition from "./reports/fundRequisition/landing/tableHeader";
import IndentPoLc from "./reports/indentPoLc/landing/tableHeader";
import InsuranceBill from "./reports/insuranceBill/landing/tableHeader";
import InsuranceCoverNote from "./reports/insuranceCoverNote/landing/tableHeader";
import LCSummary from "./reports/lcSummary/landing/tableHeader";
import OutStandingLc from "./reports/outstandingLc/landing/tableHeader";
import CnFChargesForm from "./transaction/CnFCharges/form/addEditForm";
import CnFChargesLanding from "./transaction/CnFCharges/landing/table";
import CnFServiceList from "./transaction/CnFServiceList/landing/table";
import LCAmendmentForm from "./transaction/LCAmendment/form/addEditForm";
import LCAmendmentLanding from "./transaction/LCAmendment/landing/table";
import LCSummaryCollapsePanel from "./transaction/LCSummary/Collapse";
import CleainingChargeForm from "./transaction/cleaning-charges/form/addEditForm";
import CleaningCharges from "./transaction/cleaning-charges/landing/tableHeader";
import OutstandingPayment from "./transaction/commercialCosting/landing/tableHeader";
import CustomDutyForm from "./transaction/customDuty/form/addEditForm";
import CustomDutyLanding from "./transaction/customDuty/landing/table";
import CustomDutyAdvancePayment from "./transaction/customDutyAdvancePay";
import CustomDutyAdvancePayCreateEdit from "./transaction/customDutyAdvancePay/createAndEdit";
import DocumentReleaseForm from "./transaction/documentRelease/form/addEditForm";
import DocumentReleaseLanding from "./transaction/documentRelease/landing/table";
import InspectionAndSurveyForm from "./transaction/inspectionAndSurvey/form/addEditForm";
import InspectionAndSurveyLanding from "./transaction/inspectionAndSurvey/landing/table";
import InsuranceBillLanding from "./transaction/insurance-bill/landing/tableHeader";
import InsurancePaymentLanding from "./transaction/insurance-payment/landing/tableHeader";
import InsurancePolicyCollapsePanel from "./transaction/insurance/Collapse";
import InsuranceLanding from "./transaction/insurance/landing/table";
import InsuranceAmendmentForm from "./transaction/insuranceAmendment/form/addEditForm";
import InsuranceAmendmentLanding from "./transaction/insuranceAmendment/landing/table";
import LCOpenForm from "./transaction/lc-open/form/addEditForm";
import LcOpenLanding from "./transaction/lc-open/landing/tableHeader";
import LCBusinessPartnerForm from "./transaction/lcBusinessPartner/form/addEditForm";
import LCBusinessPartnerLanding from "./transaction/lcBusinessPartner/landing/table";
import LCCostSumary from "./transaction/lcCostSumary/landing/tableHeader";
import ListOfDiferredLC from "./transaction/list-of-diferred-LC/landing/table";
import PerformanceGuarantee from "./transaction/performance-guarantee/form/addEditForm";
import PortCharges from "./transaction/port-charges/landing/tableHeader";
import ProformaInvoiceForm from "./transaction/proforma-invoice/form/addEditForm";
import ProformaInvoiceLanding from "./transaction/proforma-invoice/landing/tableHeader";
import shipmentAndPackingForm from "./transaction/shipmentAndPacking/Collapse";
import shipmentAndPackingLanding from "./transaction/shipmentAndPacking/landing/tableHeader";
import ShippingChargeForm from "./transaction/shipping-charges/form/addEditForm";
import ShippingChargesLanding from "./transaction/shipping-charges/landing/table";
import TransportChargesForm from "./transaction/transportCharges/form/addEditForm";
import TransportChargesLanding from "./transaction/transportCharges/landing/table";
import UnloadingChargesForm from "./transaction/unloading-charges/form/addEditForm";
import UnloadingCharges from "./transaction/unloading-charges/landing/tableHeader";
import PurchasePlanningAndScheduling from "./reports/purchasePlanning";
import CustomsRTGSLanding from "./transaction/customsRTGS/landing";
import CustomsRTGSCreate from "./transaction/customsRTGS/create";
import ShipmentTracking from "./reports/shipmentTracking";

export function importManagementPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/transport-management"
          to="/managementImport/transaction"
        />
        {/* Insurance Policy */}
        <ContentRoute
          path="/managementImport/transaction/insurance-policy/create"
          component={InsurancePolicyCollapsePanel}
        />
        <ContentRoute
          path="/managementImport/transaction/insurance-policy/:type/:id"
          component={InsurancePolicyCollapsePanel}
        />
        <ContentRoute
          path="/managementImport/transaction/insurance-policy"
          component={InsuranceLanding}
        />
        {/* Insurance Amendment */}
        <ContentRoute
          path="/managementImport/transaction/insurance-amendment/create"
          component={InsuranceAmendmentForm}
        />
        <ContentRoute
          path="/managementImport/transaction/insurance-amendment"
          component={InsuranceAmendmentLanding}
        />
        {/* List of Diferred LC */}
        <ContentRoute
          path="/managementImport/transaction/list-of-diferred-LC"
          component={ListOfDiferredLC}
        />
        {/* LC Amendment */}
        <ContentRoute
          path="/managementImport/transaction/lc-amendment/:type/:pid"
          component={LCAmendmentForm}
        />
        <ContentRoute
          path="/managementImport/transaction/lc-amendment/create"
          component={LCAmendmentForm}
        />
        <ContentRoute
          path="/managementImport/transaction/lc-amendment"
          component={LCAmendmentLanding}
        />
        {/* LC Summary */}
        <ContentRoute
          path="/managementImport/transaction/lc-summary"
          component={LCSummaryCollapsePanel}
        />
        {/* LC open start */}
        <ContentRoute
          path="/managementImport/transaction/lc-open/:type/:pid"
          component={LCOpenForm}
        />
        <ContentRoute
          path="/managementImport/transaction/lc-open/create"
          component={LCOpenForm}
        />
        <ContentRoute
          path="/managementImport/transaction/lc-open"
          component={LcOpenLanding}
        />
        {/* LC open finished */}
        <ContentRoute
          path="/managementImport/transaction/document-release/create"
          component={DocumentReleaseForm}
        />
        <ContentRoute
          path="/managementImport/transaction/document-release/view"
          component={DocumentReleaseForm}
        />
        <ContentRoute
          path="/managementImport/transaction/document-release"
          component={DocumentReleaseLanding}
        />
        {/* Document Release Finished */}
        <ContentRoute
          path="/managementImport/transaction/customs-duty/create"
          component={CustomDutyForm}
        />
        <ContentRoute
          path="/managementImport/transaction/customs-duty/:type/:cdId"
          component={CustomDutyForm}
        />
        <ContentRoute
          path="/managementImport/transaction/customs-duty"
          component={CustomDutyLanding}
        />
        {/* Insurance Bill start */}
        <ContentRoute
          path="/managementImport/transaction/insurance-bill"
          component={InsuranceBillLanding}
        />
        {/* Insurance Bill finished */}
        {/* Insurance Payment start */}
        <ContentRoute
          path="/managementImport/transaction/insurance-payment"
          component={InsurancePaymentLanding}
        />
        {/* Insurance Payment finished */}
        {/*LC Cost Sumary start */}
        <ContentRoute
          path="/managementImport/transaction/lc-cost-summary"
          component={LCCostSumary}
        />
        {/*LC Cost Sumary finished */}
        {/* Shipment And Packing start */}
        <ContentRoute
          path="/managementImport/transaction/shipment/create"
          component={shipmentAndPackingForm}
        />
        <ContentRoute
          path="/managementImport/transaction/shipment/:type/:id"
          component={shipmentAndPackingForm}
        />
        <ContentRoute
          path="/managementImport/transaction/shipment/edit/:shipmentId"
          component={shipmentAndPackingForm}
        />
        <ContentRoute
          path="/managementImport/transaction/shipment"
          component={shipmentAndPackingLanding}
        />
        {/* Shipment And Packing End */}
        {/* performance guarantee start */}
        <ContentRoute
          path="/managementImport/transaction/performance-guarantee"
          component={PerformanceGuarantee}
        />
        {/* performance guarantee end */}
        {/* washing and cleaing charge start */}
        <ContentRoute
          path="/managementImport/transaction/cleaning-charges/create"
          component={CleainingChargeForm}
        />
        <ContentRoute
          path="/managementImport/transaction/cleaning-charges"
          component={CleaningCharges}
        />
        {/* washing and cleaing charge finished */}
        {/* unloading charge start */}
        <ContentRoute
          path="/managementImport/transaction/unloading-charges/create"
          component={UnloadingChargesForm}
        />
        <ContentRoute
          path="/managementImport/transaction/unloading-charges"
          component={UnloadingCharges}
        />
        {/* unloading charge finished */}
        {/* port charge start */}
        <ContentRoute
          path="/managementImport/transaction/all-charge"
          component={PortCharges}
        />
        {/* outstanding payment */}
        <ContentRoute
          path="/managementImport/transaction/outstanding-payment"
          component={OutstandingPayment}
        />
        {/* port charge finished */}
        {/* Shipping charge start */}
        <ContentRoute
          path="/managementImport/transaction/shipping-charges/create"
          component={ShippingChargeForm}
        />
        <ContentRoute
          path="/managementImport/transaction/shipping-charges/:type/:pid"
          component={ShippingChargeForm}
        />
        <ContentRoute
          path="/managementImport/transaction/shipping-charges"
          component={ShippingChargesLanding}
        />
        {/* Shipping charge finished */}
        {/* Inspection And Survey */}
        <ContentRoute
          path="/managementImport/transaction/inspection-and-survey/create"
          component={InspectionAndSurveyForm}
        />
        <ContentRoute
          path="/managementImport/transaction/inspection-and-survey"
          component={InspectionAndSurveyLanding}
        />
        {/* Transport Charges */}
        <ContentRoute
          path="/managementImport/transaction/transport-charges/create"
          component={TransportChargesForm}
        />
        <ContentRoute
          path="/managementImport/transaction/transport-charges"
          component={TransportChargesLanding}
        />
        {/* CnF Service List */}
        <ContentRoute
          path="/managementImport/transaction/cnf-service-list"
          component={CnFServiceList}
        />
        {/* CnF Charges */}
        <ContentRoute
          path="/managementImport/transaction/cnf-charges/create"
          component={CnFChargesForm}
        />
        <ContentRoute
          path="/managementImport/transaction/cnf-charges"
          component={CnFChargesLanding}
        />
        {/* LC Business Partner Landing */}
        <ContentRoute
          path="/managementImport/transaction/lc-business-partner/create"
          component={LCBusinessPartnerForm}
        />
        {/* find this one */}
        <ContentRoute
          path="/managementImport/transaction/lc-business-partner/:type/:businessID/:businessPartnerTypeId"
          component={LCBusinessPartnerForm}
        />
        <ContentRoute
          path="/managementImport/transaction/lc-business-partner"
          component={LCBusinessPartnerLanding}
        />
        {/* Commercial Payment */}
        {/* Reports - Indent PO LC */}
        <ContentRoute
          path="/managementImport/reports/indent-po-lc"
          component={IndentPoLc}
        />
        {/* Insurance Cover Note */}
        <ContentRoute
          path="/managementImport/reports/insurance-cover-note"
          component={InsuranceCoverNote}
        />
        {/* Insurance Bill */}
        <ContentRoute
          path="/managementImport/reports/insurance-bill"
          component={InsuranceBill}
        />
        {/* Document Details */}
        <ContentRoute
          path="/managementImport/reports/document-release"
          component={DocumentRelease}
        />
        {/* Duty Summary */}
        <ContentRoute
          path="/managementImport/reports/duty-summary"
          component={DutySummary}
        />
        {/* Cost Summary */}
        <ContentRoute
          path="/managementImport/reports/cost-summary"
          component={CostSummary}
        />
        {/* LC Summary */}
        <ContentRoute
          path="/managementImport/reports/lc-summary"
          component={LCSummary}
        />
        {/* CnF Details */}
        <ContentRoute
          path="/managementImport/reports/cnf-details"
          component={CnFDetails}
        />
        <ContentRoute
          path="/managementImport/reports/lc-cost-sheet-partnerwise"
          component={LcCostSheetPartnerWise}
        />
        <ContentRoute
          path="/managementImport/reports/PurchasePlanningScheduling"
          component={PurchasePlanningAndScheduling}
        />
        <ContentRoute
          path="/managementImport/reports/ShipmentTracking"
          component={ShipmentTracking}
        />
        d{/* Outstanding LC */}
        <ContentRoute
          path="/managementImport/reports/outstanding-lc"
          component={OutStandingLc}
        />
        {/* Outstanding LC */}
        <ContentRoute
          path="/managementImport/reports/cnf-payment-details"
          component={CnfPaymentDetails}
        />
        {/* Item Wise Stock */}
        <ContentRoute
          path="/managementImport/reports/item-wise-stock"
          component={ItemWiseStock}
        />
        {/* Fund Requisition */}
        <ContentRoute
          path="/managementImport/reports/fund-requisition"
          component={FundRequisition}
        />
        {/* Proforma Invoice */}
        <ContentRoute
          path="/managementImport/transaction/proforma-invoice/:type/:pid"
          component={ProformaInvoiceForm}
        />
        <ContentRoute
          path="/managementImport/transaction/proforma-invoice/add"
          component={ProformaInvoiceForm}
        />
        <ContentRoute
          path="/managementImport/transaction/proforma-invoice"
          component={ProformaInvoiceLanding}
        />
        <ContentRoute
          path="/managementImport/transaction/advance-payment-customs-duty/edit/:id"
          component={CustomDutyAdvancePayCreateEdit}
        />
        <ContentRoute
          path="/managementImport/transaction/advance-payment-customs-duty/create"
          component={CustomDutyAdvancePayCreateEdit}
        />
        <ContentRoute
          path="/managementImport/transaction/advance-payment-customs-duty"
          component={CustomDutyAdvancePayment}
        />
        <ContentRoute
          path="/managementImport/transaction/customs-rtgs/edit/:id"
          component={CustomsRTGSCreate}
        />
        <ContentRoute
          path="/managementImport/transaction/customs-rtgs/create"
          component={CustomsRTGSCreate}
        />
        <ContentRoute
          path="/managementImport/transaction/customs-rtgs"
          component={CustomsRTGSLanding}
        />
      </Switch>
    </Suspense>
  );
}

export default importManagementPages;
