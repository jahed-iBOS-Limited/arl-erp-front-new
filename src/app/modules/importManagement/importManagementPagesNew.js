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
import CnFChargesForm from "./transactionNew/CnFCharges/form/addEditForm";
import CnFChargesLanding from "./transactionNew/CnFCharges/landing/table";
import CnFServiceList from "./transactionNew/CnFServiceList/landing/table";
import LCAmendmentForm from "./transactionNew/LCAmendment/form/addEditForm";
import LCAmendmentLanding from "./transactionNew/LCAmendment/landing/table";
import LCSummaryCollapsePanel from "./transactionNew/LCSummary/Collapse";
import CleainingChargeForm from "./transactionNew/cleaning-charges/form/addEditForm";
import CleaningCharges from "./transactionNew/cleaning-charges/landing/tableHeader";
import OutstandingPayment from "./transactionNew/commercialCosting/landing/tableHeader";
import CustomDutyForm from "./transactionNew/customDuty/form/addEditForm";
import CustomDutyLanding from "./transactionNew/customDuty/landing/table";
import CustomDutyAdvancePayment from "./transactionNew/customDutyAdvancePay";
import CustomDutyAdvancePayCreateEdit from "./transactionNew/customDutyAdvancePay/createAndEdit";
import DocumentReleaseForm from "./transactionNew/documentRelease/form/addEditForm";
import DocumentReleaseLanding from "./transactionNew/documentRelease/landing/table";
import InspectionAndSurveyForm from "./transactionNew/inspectionAndSurvey/form/addEditForm";
import InspectionAndSurveyLanding from "./transactionNew/inspectionAndSurvey/landing/table";
import InsuranceBillLanding from "./transactionNew/insurance-bill/landing/tableHeader";
import InsurancePaymentLanding from "./transactionNew/insurance-payment/landing/tableHeader";
import InsurancePolicyCollapsePanel from "./transactionNew/insurance/Collapse";
import InsuranceLanding from "./transactionNew/insurance/landing/table";
import InsuranceAmendmentForm from "./transactionNew/insuranceAmendment/form/addEditForm";
import InsuranceAmendmentLanding from "./transactionNew/insuranceAmendment/landing/table";
import LCOpenForm from "./transactionNew/lc-open/form/addEditForm";
import LcOpenLanding from "./transactionNew/lc-open/landing/tableHeader";
import LCBusinessPartnerForm from "./transactionNew/lcBusinessPartner/form/addEditForm";
import LCBusinessPartnerLanding from "./transactionNew/lcBusinessPartner/landing/table";
import LCCostSumary from "./transactionNew/lcCostSumary/landing/tableHeader";
import ListOfDiferredLC from "./transactionNew/list-of-diferred-LC/landing/table";
import PerformanceGuarantee from "./transactionNew/performance-guarantee/form/addEditForm";
import PortCharges from "./transactionNew/port-charges/landing/tableHeader";
import ProformaInvoiceForm from "./transaction/proforma-invoice/form/addEditForm";
import ProformaInvoiceLanding from "./transaction/proforma-invoice/landing/tableHeader";
import shipmentAndPackingForm from "./transactionNew/shipmentAndPacking/Collapse";
import shipmentAndPackingLanding from "./transactionNew/shipmentAndPacking/landing/tableHeader";
import ShippingChargeForm from "./transactionNew/shipping-charges/form/addEditForm";
import ShippingChargesLanding from "./transactionNew/shipping-charges/landing/table";
import TransportChargesForm from "./transactionNew/transportCharges/form/addEditForm";
import TransportChargesLanding from "./transactionNew/transportCharges/landing/table";
import UnloadingChargesForm from "./transactionNew/unloading-charges/form/addEditForm";
import UnloadingCharges from "./transactionNew/unloading-charges/landing/tableHeader";

const oldTransactionroutes = [
  {
    path: "/managementImport/transaction/proforma-invoice/:type/:pid",
    Component: ProformaInvoiceForm,
  },
  {
    path: "/managementImport/transaction/proforma-invoice/add",
    Component: ProformaInvoiceForm,
  },
  {
    path: "/managementImport/transaction/proforma-invoice",
    Component: ProformaInvoiceLanding,
  },
  {
    path: "/managementImport/transaction/insurance-policy/create",
    Component: InsurancePolicyCollapsePanel,
  },
  {
    path: "/managementImport/transaction/insurance-policy/:type/:id",
    Component: InsurancePolicyCollapsePanel,
  },
  {
    path: "/managementImport/transaction/insurance-policy",
    Component: InsuranceLanding,
  },
  {
    path: "/managementImport/transaction/insurance-amendment/create",
    Component: InsuranceAmendmentForm,
  },
  {
    path: "/managementImport/transaction/insurance-amendment",
    Component: InsuranceAmendmentLanding,
  },
  {
    path: "/managementImport/transaction/list-of-diferred-LC",
    Component: ListOfDiferredLC,
  },
  {
    path: "/managementImport/transaction/lc-amendment/:type/:pid",
    Component: LCAmendmentForm,
  },
  {
    path: "/managementImport/transaction/lc-amendment/create",
    Component: LCAmendmentForm,
  },
  {
    path: "/managementImport/transaction/lc-amendment",
    Component: LCAmendmentLanding,
  },
  {
    path: "/managementImport/transaction/lc-summary",
    Component: LCSummaryCollapsePanel,
  },
  {
    path: "/managementImport/transaction/lc-open/:type/:pid",
    Component: LCOpenForm,
  },
  {
    path: "/managementImport/transaction/lc-open/create",
    Component: LCOpenForm,
  },
  {
    path: "/managementImport/transaction/lc-open",
    Component: LcOpenLanding,
  },
  {
    path: "/managementImport/transaction/document-release/create",
    Component: DocumentReleaseForm,
  },
  {
    path: "/managementImport/transaction/document-release/view",
    Component: DocumentReleaseForm,
  },
  {
    path: "/managementImport/transaction/document-release",
    Component: DocumentReleaseLanding,
  },
  {
    path: "/managementImport/transaction/customs-duty/create",
    Component: CustomDutyForm,
  },
  {
    path: "/managementImport/transaction/customs-duty/:type/:cdId",
    Component: CustomDutyForm,
  },
  {
    path: "/managementImport/transaction/customs-duty",
    Component: CustomDutyLanding,
  },
  {
    path: "/managementImport/transaction/insurance-bill",
    Component: InsuranceBillLanding,
  },
  {
    path: "/managementImport/transaction/insurance-payment",
    Component: InsurancePaymentLanding,
  },
  {
    path: "/managementImport/transaction/lc-cost-summary",
    Component: LCCostSumary,
  },
  {
    path: "/managementImport/transaction/shipment/create",
    Component: shipmentAndPackingForm,
  },
  {
    path: "/managementImport/transaction/shipment/:type/:id",
    Component: shipmentAndPackingForm,
  },
  {
    path: "/managementImport/transaction/shipment/edit/:shipmentId",
    Component: shipmentAndPackingForm,
  },
  {
    path: "/managementImport/transaction/shipment",
    Component: shipmentAndPackingLanding,
  },
  {
    path: "/managementImport/transaction/performance-guarantee",
    Component: PerformanceGuarantee,
  },
  {
    path: "/managementImport/transaction/cleaning-charges/create",
    Component: CleainingChargeForm,
  },
  {
    path: "/managementImport/transaction/cleaning-charges",
    Component: CleaningCharges,
  },
  {
    path: "/managementImport/transaction/unloading-charges/create",
    Component: UnloadingChargesForm,
  },
  {
    path: "/managementImport/transaction/unloading-charges",
    Component: UnloadingCharges,
  },
  {
    path: "/managementImport/transaction/all-charge",
    Component: PortCharges,
  },
  {
    path: "/managementImport/transaction/outstanding-payment",
    Component: OutstandingPayment,
  },
  {
    path: "/managementImport/transaction/shipping-charges/create",
    Component: ShippingChargeForm,
  },
  {
    path: "/managementImport/transaction/shipping-charges/:type/:pid",
    Component: ShippingChargeForm,
  },
  {
    path: "/managementImport/transaction/shipping-charges",
    Component: ShippingChargesLanding,
  },
  {
    path: "/managementImport/transaction/inspection-and-survey/create",
    Component: InspectionAndSurveyForm,
  },
  {
    path: "/managementImport/transaction/inspection-and-survey",
    Component: InspectionAndSurveyLanding,
  },
  {
    path: "/managementImport/transaction/transport-charges/create",
    Component: TransportChargesForm,
  },
  {
    path: "/managementImport/transaction/transport-charges",
    Component: TransportChargesLanding,
  },
  {
    path: "/managementImport/transaction/cnf-service-list",
    Component: CnFServiceList,
  },
  {
    path: "/managementImport/transaction/cnf-charges/create",
    Component: CnFChargesForm,
  },
  {
    path: "/managementImport/transaction/cnf-charges",
    Component: CnFChargesLanding,
  },
  {
    path: "/managementImport/transaction/lc-business-partner/create",
    Component: LCBusinessPartnerForm,
  },
  {
    path:
      "/managementImport/transaction/lc-business-partner/:type/:businessID/:businessPartnerTypeId",
    Component: LCBusinessPartnerForm,
  },
  {
    path: "/managementImport/transaction/lc-business-partner",
    Component: LCBusinessPartnerLanding,
  },
];

export function importManagementPagesNew() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/transport-management"
          to="/managementImport/transactionNew/insurance-policy"
        />

        {/* #Old routes start - temporary */}

        {/* #Old routes start - temporary
            #must be deleted after developing the new feature
          */
        oldTransactionroutes.map((route) => {
          const { path, Component } = route;
          return <ContentRoute path={path} component={Component} />;
        })}

        {/* Old routes end - temporary */}

        {/* Insurance Policy */}
        <ContentRoute
          path="/managementImport/transactionNew/insurance-policy/create"
          component={InsurancePolicyCollapsePanel}
        />
        <ContentRoute
          path="/managementImport/transactionNew/insurance-policy/:type/:id"
          component={InsurancePolicyCollapsePanel}
        />
        <ContentRoute
          path="/managementImport/transactionNew/insurance-policy"
          component={InsuranceLanding}
        />

        {/* Insurance Amendment */}
        <ContentRoute
          path="/managementImport/transactionNew/insurance-amendment/create"
          component={InsuranceAmendmentForm}
        />
        <ContentRoute
          path="/managementImport/transactionNew/insurance-amendment"
          component={InsuranceAmendmentLanding}
        />

        {/* List of Diferred LC */}
        <ContentRoute
          path="/managementImport/transactionNew/list-of-diferred-LC"
          component={ListOfDiferredLC}
        />

        {/* LC Amendment */}
        <ContentRoute
          path="/managementImport/transactionNew/lc-amendment/:type/:pid"
          component={LCAmendmentForm}
        />
        <ContentRoute
          path="/managementImport/transactionNew/lc-amendment/create"
          component={LCAmendmentForm}
        />
        <ContentRoute
          path="/managementImport/transactionNew/lc-amendment"
          component={LCAmendmentLanding}
        />

        {/* LC Summary */}
        <ContentRoute
          path="/managementImport/transactionNew/lc-summary"
          component={LCSummaryCollapsePanel}
        />
        {/* LC open start */}

        <ContentRoute
          path="/managementImport/transactionNew/lc-open/:type/:pid"
          component={LCOpenForm}
        />
        <ContentRoute
          path="/managementImport/transactionNew/lc-open/create"
          component={LCOpenForm}
        />
        <ContentRoute
          path="/managementImport/transactionNew/lc-open"
          component={LcOpenLanding}
        />
        {/* LC open finished */}

        <ContentRoute
          path="/managementImport/transactionNew/document-release/create"
          component={DocumentReleaseForm}
        />
        <ContentRoute
          path="/managementImport/transactionNew/document-release/view"
          component={DocumentReleaseForm}
        />
        <ContentRoute
          path="/managementImport/transactionNew/document-release"
          component={DocumentReleaseLanding}
        />
        {/* Document Release Finished */}

        <ContentRoute
          path="/managementImport/transactionNew/customs-duty/create"
          component={CustomDutyForm}
        />
        <ContentRoute
          path="/managementImport/transactionNew/customs-duty/:type/:cdId"
          component={CustomDutyForm}
        />
        <ContentRoute
          path="/managementImport/transactionNew/customs-duty"
          component={CustomDutyLanding}
        />
        {/* Insurance Bill start */}
        <ContentRoute
          path="/managementImport/transactionNew/insurance-bill"
          component={InsuranceBillLanding}
        />
        {/* Insurance Bill finished */}

        {/* Insurance Payment start */}
        <ContentRoute
          path="/managementImport/transactionNew/insurance-payment"
          component={InsurancePaymentLanding}
        />
        {/* Insurance Payment finished */}

        {/*LC Cost Sumary start */}
        <ContentRoute
          path="/managementImport/transactionNew/lc-cost-summary"
          component={LCCostSumary}
        />
        {/*LC Cost Sumary finished */}

        {/* Shipment And Packing start */}
        <ContentRoute
          path="/managementImport/transactionNew/shipment/create"
          component={shipmentAndPackingForm}
        />
        <ContentRoute
          path="/managementImport/transactionNew/shipment/:type/:id"
          component={shipmentAndPackingForm}
        />
        <ContentRoute
          path="/managementImport/transactionNew/shipment/edit/:shipmentId"
          component={shipmentAndPackingForm}
        />
        <ContentRoute
          path="/managementImport/transactionNew/shipment"
          component={shipmentAndPackingLanding}
        />
        {/* Shipment And Packing End */}
        {/* performance guarantee start */}
        <ContentRoute
          path="/managementImport/transactionNew/performance-guarantee"
          component={PerformanceGuarantee}
        />
        {/* performance guarantee end */}

        {/* washing and cleaing charge start */}
        <ContentRoute
          path="/managementImport/transactionNew/cleaning-charges/create"
          component={CleainingChargeForm}
        />
        <ContentRoute
          path="/managementImport/transactionNew/cleaning-charges"
          component={CleaningCharges}
        />
        {/* washing and cleaing charge finished */}

        {/* unloading charge start */}
        <ContentRoute
          path="/managementImport/transactionNew/unloading-charges/create"
          component={UnloadingChargesForm}
        />
        <ContentRoute
          path="/managementImport/transactionNew/unloading-charges"
          component={UnloadingCharges}
        />
        {/* unloading charge finished */}

        {/* port charge start */}
        <ContentRoute
          path="/managementImport/transactionNew/all-charge"
          component={PortCharges}
        />
        {/* outstanding payment */}
        <ContentRoute
          path="/managementImport/transactionNew/outstanding-payment"
          component={OutstandingPayment}
        />
        {/* port charge finished */}

        {/* Shipping charge start */}
        <ContentRoute
          path="/managementImport/transactionNew/shipping-charges/create"
          component={ShippingChargeForm}
        />
        <ContentRoute
          path="/managementImport/transactionNew/shipping-charges/:type/:pid"
          component={ShippingChargeForm}
        />
        <ContentRoute
          path="/managementImport/transactionNew/shipping-charges"
          component={ShippingChargesLanding}
        />
        {/* Shipping charge finished */}

        {/* Inspection And Survey */}
        <ContentRoute
          path="/managementImport/transactionNew/inspection-and-survey/create"
          component={InspectionAndSurveyForm}
        />
        <ContentRoute
          path="/managementImport/transactionNew/inspection-and-survey"
          component={InspectionAndSurveyLanding}
        />

        {/* Transport Charges */}
        <ContentRoute
          path="/managementImport/transactionNew/transport-charges/create"
          component={TransportChargesForm}
        />
        <ContentRoute
          path="/managementImport/transactionNew/transport-charges"
          component={TransportChargesLanding}
        />

        {/* CnF Service List */}
        <ContentRoute
          path="/managementImport/transactionNew/cnf-service-list"
          component={CnFServiceList}
        />

        {/* CnF Charges */}
        <ContentRoute
          path="/managementImport/transactionNew/cnf-charges/create"
          component={CnFChargesForm}
        />
        <ContentRoute
          path="/managementImport/transactionNew/cnf-charges"
          component={CnFChargesLanding}
        />

        {/* LC Business Partner Landing */}
        <ContentRoute
          path="/managementImport/transactionNew/lc-business-partner/create"
          component={LCBusinessPartnerForm}
        />
        {/* find this one */}
        <ContentRoute
          path="/managementImport/transactionNew/lc-business-partner/:type/:businessID/:businessPartnerTypeId"
          component={LCBusinessPartnerForm}
        />
        <ContentRoute
          path="/managementImport/transactionNew/lc-business-partner"
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
        {/* Outstanding LC */}
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
        {/* <ContentRoute
          path="/managementImport/transactionNew/proforma-invoice/:type/:pid"
          component={ProformaInvoiceForm}
        />
        <ContentRoute
          path="/managementImport/transactionNew/proforma-invoice/add"
          component={ProformaInvoiceForm}
        />
        <ContentRoute
          path="/managementImport/transactionNew/proforma-invoice"
          component={ProformaInvoiceLanding}
        /> */}

        <ContentRoute
          path="/managementImport/transactionNew/advance-payment-customs-duty/edit/:id"
          component={CustomDutyAdvancePayCreateEdit}
        />
        <ContentRoute
          path="/managementImport/transactionNew/advance-payment-customs-duty/create"
          component={CustomDutyAdvancePayCreateEdit}
        />
        <ContentRoute
          path="/managementImport/transactionNew/advance-payment-customs-duty"
          component={CustomDutyAdvancePayment}
        />
      </Switch>
    </Suspense>
  );
}

export default importManagementPagesNew;
