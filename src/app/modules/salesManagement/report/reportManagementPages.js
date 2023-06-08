import React from "react";
import { Redirect, Switch } from "react-router-dom";
// import LoadUnloadBill from "./loadUnloadBill";
import { ContentRoute } from "../../../../_metronic/layout";
import RecivableDueReport from "./recivableReport";
import DeliveryReportTable from "./deliveryReport/Table/table";
import { PendingOrder } from "./pendingOrder";
// import { PartnerLedger } from "./partnerLedger";
// import PartnerLedgerForm from "./partnerLedger/Form/addEditForm";
import SalesReport from "./salesReport";
import { SalesDetails } from "./salesDetails";
import CustomerSalesTarget from "./customerSalesTarget";
import { CustomerSalesTargetForm } from "./customerSalesTarget/form/addEditForm";
import { CustomerSalesTargetViewForm } from "./customerSalesTarget/view/addEditForm";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import { shallowEqual, useSelector } from "react-redux";
import SalesOrderReportLanding from "./salesOrderReport/landing/index";
import findIndex from "./../../_helper/_findIndex";
import { CustomerStatementReport } from "./customerStatement";
import { CustomerStatementModifiedReport } from "./customerStatementModified";
import ChannelWiseSalesReportLanding from "./channelWiseSales/landing/table";
import DeliveryRequestReport from "./deliveryRequestReport/Table/table";
import SalesReportEssentialTable from "./salesReportEssential/Table/table";
import PartnerAllotmentReport from "./partnerAllotment/Table/table";
import SalesTrendsAnalysisReportLanding from "./salesTrendAnalysis/landing/table";
import OrderDetailsReportLanding from "./orderDetailsReport/landing/index";
import SalesOrderHistoryLanding from "./salesOrderHistory/landing/form";
import ItemWiseOrderReport from "./itemWiseOrderReport/landing";
import SalesCommissionReportLanding from "./salesCommissionReport/landing/table";
import AllotmentSalesReport from "./allotmentSalesReport/Table";
import CustomerCreditLimitReport from "./customerCreditLimit/landing/table";
import BankGuaranteeReport from "./bankGuaranteeReport/landing/table";
import { SalesReportOMS } from "./../orderManagement/salesReportOMS/index";
import ShipToPartyDelivery from "./shipToPartyDelivery/Table/table";
import CustomerSalesTargetReport from "./customerSalesTargetReport/index";
import AttachmentUpload from "./attachmentUpload/landing";
import DeliverySalesPending from "./deliverySalesPending/landing/table";
import Salesanalytics from "./salesanalytics";
import OperationalSetUpBaseAchievementLanding from "./OperationalSetUpBaseAchievementReport/Table/table";
import ManpowerSalesTargetTable from "./manpowerSalesTarget/landing/table";
import ManpowerSalesTargetForm from "./manpowerSalesTarget/form/addEditForm";
import RetailAndDistributorAchievement from "./retailAndDistAchivment/landing/form";
import CommissionReportAndJVTable from "./commissionReportAndJV/table/table";
import FertilizerReportLanding from "./fartilizerReport/landing";
import CustomerCollectionTarget from "./customerCollectionTarget";
import { CustomerCollectionTargetForm } from "./customerCollectionTarget/form/addEditForm";
import VehicleArrangeInfo from "./vehicleArrangeInfo/landing/table";
import CustomerBalanceDaysNLimit from "./customerBalanceDayNLimit/landing/table";
import LoadUnloadBill from "./loadUnloadBill/Table/form";

export function ReportManagementPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const customerSalesTarget =
    userRole[findIndex(userRole, "Customer Sales Target")];

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/sales-management/report"
        to="/sales-management/report"
      />

      <ContentRoute
        path="/sales-management/report/loadUnloadBill"
        component={LoadUnloadBill}
      />
      {/* Recivable due Report */}
      <ContentRoute
        path="/sales-management/report/receivableDueReport"
        component={RecivableDueReport}
      />

      {/* Delivery Report */}
      <ContentRoute
        path="/sales-management/report/deliveryreport"
        component={DeliveryReportTable}
      />
      <ContentRoute
        path="/sales-management/report/pendingOrder"
        component={PendingOrder}
      />

      {/* Partner Ledger */}
      {/* <ContentRoute
        path="/sales-management/report/partnerLedger/add"
        component={PartnerLedgerForm}
      />

      <ContentRoute
        path="/sales-management/report/partnerLedger"
        component={PartnerLedger}
      /> */}

      {/* Sales Report */}
      <ContentRoute
        path="/sales-management/report/salesReport"
        component={SalesReport}
      />
      {/* Sales Report Essential */}
      <ContentRoute
        path="/sales-management/report/salesReportEssential"
        component={SalesReportEssentialTable}
      />

      {/* Customer Statement Report */}
      <ContentRoute
        path="/sales-management/report/customerStatement"
        component={CustomerStatementReport}
      />

      {/* Customer Statement Report Modified*/}
      <ContentRoute
        path="/sales-management/report/customerStatementModified"
        component={CustomerStatementModifiedReport}
      />

      {/* Sales Details */}
      <ContentRoute
        path="/sales-management/report/salesdetails"
        component={SalesDetails}
      />

      {/* <ContentRoute
        path="/sales-management/report/partnerLedger/add"
        component={CustomerSalesTarget}
      /> */}
      {/* Customer Sales target */}

      <ContentRoute
        path="/sales-management/report/customersalestarget/approve/:approveid"
        component={CustomerSalesTargetForm}
      />

      <ContentRoute
        path="/sales-management/report/customersalestarget/create"
        component={
          customerSalesTarget?.isCreate
            ? CustomerSalesTargetForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/sales-management/report/customersalestarget/edit/:id"
        component={
          customerSalesTarget?.isEdit
            ? CustomerSalesTargetForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/sales-management/report/customersalestarget/view/:viewid"
        component={
          customerSalesTarget?.isView
            ? CustomerSalesTargetViewForm
            : NotPermittedPage
        }
      />

      <ContentRoute
        path="/sales-management/report/customersalestarget"
        component={CustomerSalesTarget}
      />

      {/* Manpower sales target */}
      <ContentRoute
        path="/sales-management/report/manpowersalestarget/create"
        component={ManpowerSalesTargetForm}
      />
      <ContentRoute
        path="/sales-management/report/manpowersalestarget"
        component={ManpowerSalesTargetTable}
      />

      {/* Sales Order Report */}
      <ContentRoute
        path="/sales-management/report/salesOrderReport"
        component={SalesOrderReportLanding}
      />

      {/* Channel Wise Sales Report */}
      <ContentRoute
        path="/sales-management/report/ChannelWiseSales"
        component={ChannelWiseSalesReportLanding}
      />

      {/* Delivery Request Report */}
      <ContentRoute
        path="/sales-management/report/DeliveryRequestReport"
        component={DeliveryRequestReport}
      />

      {/* Partner Allotment Report */}
      <ContentRoute
        path="/sales-management/report/partnerAllotmentReport"
        component={PartnerAllotmentReport}
      />

      {/* Sales Trends Analysis Report */}
      <ContentRoute
        path="/sales-management/report/salesTrendAnalysis"
        component={SalesTrendsAnalysisReportLanding}
      />

      <ContentRoute
        path="/sales-management/report/orderDetailsReport"
        component={OrderDetailsReportLanding}
      />
      {/* Sales Order History Report */}
      <ContentRoute
        path="/sales-management/report/salesOrderHistory"
        component={SalesOrderHistoryLanding}
      />
      <ContentRoute
        path="/sales-management/report/itemWiseOrderReport"
        component={ItemWiseOrderReport}
      />

      {/* Sales Commission Report Report */}
      <ContentRoute
        path="/sales-management/report/salesCommissionReport"
        component={SalesCommissionReportLanding}
      />

      <ContentRoute
        path="/sales-management/report/allotmentSalesReport"
        component={AllotmentSalesReport}
      />
      <ContentRoute
        path="/sales-management/report/customerCreditLimit"
        component={CustomerCreditLimitReport}
      />
      <ContentRoute
        path="/sales-management/report/customerbalancedaysnlimit"
        component={CustomerBalanceDaysNLimit}
      />
      <ContentRoute
        path="/sales-management/report/bankGuaranteeReport"
        component={BankGuaranteeReport}
      />
      <ContentRoute
        path="/sales-management/report/sales_report_vat"
        component={SalesReportOMS}
      />
      <ContentRoute
        path="/sales-management/report/shipToPartyDelivery"
        component={ShipToPartyDelivery}
      />
      <ContentRoute
        path="/sales-management/report/customerSalesTargetReport"
        component={CustomerSalesTargetReport}
      />

      <ContentRoute
        path="/sales-management/report/deliverysalespending"
        component={DeliverySalesPending}
      />
      <ContentRoute
        path="/sales-management/report/attachmentupload"
        component={AttachmentUpload}
      />
      <ContentRoute
        path="/sales-management/report/salesanalytics"
        component={Salesanalytics}
      />

      {/* Collection Report */}
      <ContentRoute
        path="/sales-management/report/setupbaseachivement"
        component={OperationalSetUpBaseAchievementLanding}
      />

      <ContentRoute
        path="/sales-management/report/RetailAndDistributorIncreaseAchievement"
        component={RetailAndDistributorAchievement}
      />

      <ContentRoute
        from="/sales-management/report/commisionReportAndJv"
        component={CommissionReportAndJVTable}
      />

      {/* Fertilizer Report */}
      <ContentRoute
        path="/sales-management/report/fartilizerReport"
        component={FertilizerReportLanding}
      />

      {/* Customer collection target */}
      <ContentRoute
        path="/sales-management/report/customercollectiontarget/entry"
        component={CustomerCollectionTargetForm}
      />
      <ContentRoute
        path="/sales-management/report/customercollectiontarget"
        component={CustomerCollectionTarget}
      />

      <ContentRoute
        path="/sales-management/report/vehiclearrangeinfo"
        component={VehicleArrangeInfo}
      />
    </Switch>
  );
}

export default ReportManagementPages;
