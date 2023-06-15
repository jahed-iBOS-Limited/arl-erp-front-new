import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
// import InventoryStatementTable from "./inventoryStatement/table/table";
import DeliveryReportLanding from "./deliveryReport/landing/index";
import InventoryStockTable from "./inventoryStock/table/table";
import { InventoryStatementReport } from "./InventoryStatementReport";
import { IssueReport } from "./issueStatement";
import { GRNReport } from "./genStatement";
import CollectionReportLanding from "./collectionReport/landing/index";
import DebitCreditStatus from "./debitCreditStatus/landing";
import CustomerCreditBalanceLanding from "./customerCreditBalance/landing/index";
import DeliveryReportOrganizationWise from "./deliveryReportOrganizationWise";
import PendingDeliveryReportTable from "./pendingDelivery/table/table";
import CustomerDeliveryModifiedReport from "./customerDeliveryModified/landing";
import PendingShippingReportTable from "./pendingShipping/table/table";
import PartnerCommissionLanding from "./partnerCommissionReport/landing/table";
import { DateWiseSalesReport } from "./dateWiseSalesReport/Table/table";
import { LoanRegisterReport } from "./inventoryLoanRegister/LoanRegisterReport";
import { ItemTransferTransit } from "./itemTransferTransit/Table/table";
import SupplierWisePurchase from "./supplierWisePurchase";
import CancledMRR from "./cancledMRR";
import WHStockReportVat from "./whStockReportVat";
import WarehouseWiseStockReport from "./whStockReport";

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
    </Switch>
  );
}
