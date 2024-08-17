import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
// import InventoryStatementTable from "./inventoryStatement/table/table";
import GLWiseBalance from "./GLWiseBalance";
import { InventoryStatementReport } from "./InventoryStatementReport";
import CancledMRR from "./cancledMRR";
import CollectionReportLanding from "./collectionReport/landing/index";
import CustomerCreditBalanceLanding from "./customerCreditBalance/landing/index";
import CustomerDeliveryModifiedReport from "./customerDeliveryModified/landing";
import { DateWiseSalesReport } from "./dateWiseSalesReport/Table/table";
import DebitCreditStatus from "./debitCreditStatus/landing";
import DeliveryReportLanding from "./deliveryReport/landing/index";
import DeliveryReportOrganizationWise from "./deliveryReportOrganizationWise";
import { GRNReport } from "./genStatement";
import { LoanRegisterReport } from "./inventoryLoanRegister/LoanRegisterReport";
import InventoryStatementRDLC from "./inventoryStatementRDLC";
import InventoryStockTable from "./inventoryStock/table/table";
import { IssueReport } from "./issueStatement";
import ItemAnalytics from "./itemAnalytics";
import { ItemTransferTransit } from "./itemTransferTransit/Table/table";
import PartnerCommissionLanding from "./partnerCommissionReport/landing/table";
import PendingDeliveryReportTable from "./pendingDelivery/table/table";
import PendingShippingReportTable from "./pendingShipping/table/table";
import SupplierWisePurchase from "./supplierWisePurchase";
import WarehouseWiseStockReport from "./whStockReport";
import WHStockReportVat from "./whStockReportVat";
import MROItemReports from "./MROItems";

export function ReportsPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/inventory-management/reports"
        to="/inventory-management/reports/inventoryStatement"
      />

      {/* Inventory Stock */}
      <ContentRoute
        from="/inventory-management/reports/inventoryStock"
        component={InventoryStockTable}
      />

      {/* Inventory Statement */}
      <ContentRoute
        from="/inventory-management/reports/inventoryStatement"
        component={InventoryStatementReport}
      />

      {/* Delivery Report */}
      <ContentRoute
        from="/inventory-management/reports/deliveryReport"
        component={DeliveryReportLanding}
      />

      {/* Customer Delivery Modified Report */}
      <ContentRoute
        from="/inventory-management/reports/deliveryModified"
        component={CustomerDeliveryModifiedReport}
      />

      {/* Issue Report */}
      <ContentRoute
        from="/inventory-management/reports/issue-statement"
        component={IssueReport}
      />

      {/* Grn Report */}
      <ContentRoute
        from="/inventory-management/reports/grnStatement"
        component={GRNReport}
      />

      {/* Delivery Report */}
      <ContentRoute
        from="/inventory-management/reports/customerCollectionDue"
        component={CollectionReportLanding}
      />

      {/* Debit Credit Status */}
      <ContentRoute
        from="/inventory-management/reports/customer-debit-credit-status"
        component={DebitCreditStatus}
      />

      {/* Customer Credit Balance */}
      <ContentRoute
        from="/inventory-management/reports/customerCreditBalance"
        component={CustomerCreditBalanceLanding}
      />
      {/* Delivery Report Organization Wise */}
      <ContentRoute
        path="/inventory-management/reports/deliveryReportOrganizationWise"
        component={DeliveryReportOrganizationWise}
      />
      <ContentRoute
        path="/inventory-management/reports/pendingDeliveryReport"
        component={PendingDeliveryReportTable}
      />
      <ContentRoute
        path="/inventory-management/reports/pendingShippingReport"
        component={PendingShippingReportTable}
      />

      {/* Partner Commission Report */}
      <ContentRoute
        from="/inventory-management/reports/partnerCommissionReport"
        component={PartnerCommissionLanding}
      />
      {/* Date Wise Sales Report */}
      <ContentRoute
        from="/inventory-management/reports/datewiseSalesReport"
        component={DateWiseSalesReport}
      />
      {/* inventory Loan Register Report */}
      <ContentRoute
        from="/inventory-management/reports/inventoryLoanRegister"
        component={LoanRegisterReport}
      />

      <ContentRoute
        from="/inventory-management/reports/itemTransferTransit"
        component={ItemTransferTransit}
      />
      <ContentRoute
        from="/inventory-management/reports/SupplierwisePurchase"
        component={SupplierWisePurchase}
      />
      <ContentRoute
        from="/inventory-management/reports/CancledMRR"
        component={CancledMRR}
      />
      <ContentRoute
        from="/inventory-management/reports/wh-stock-report-vat"
        component={WHStockReportVat}
      />
      <ContentRoute
        from="/inventory-management/reports/WarehouseWiseStockReport"
        component={WarehouseWiseStockReport}
      />
      <ContentRoute
        from="/inventory-management/reports/GLWiseBalance"
        component={GLWiseBalance}
      />
      <ContentRoute
        from="/inventory-management/reports/InventoryStatement_RDLC"
        component={InventoryStatementRDLC}
      />
      <ContentRoute
        from="/inventory-management/reports/ItemAnalytics"
        component={ItemAnalytics}
      />
      <ContentRoute
        from="/inventory-management/reports/MROItemPlanning"
        component={MROItemReports}
      />
    </Switch>
  );
}
