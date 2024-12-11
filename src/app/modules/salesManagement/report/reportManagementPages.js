import React from "react";
import { Redirect, Switch } from "react-router-dom";
// import LoadUnloadBill from "./loadUnloadBill";
import { ContentRoute } from "../../../../_metronic/layout";
import DeliveryReportTable from "./deliveryReport/Table/table";
import { PendingOrder } from "./pendingOrder";
import RecivableDueReport from "./recivableReport";
// import { PartnerLedger } from "./partnerLedger";
// import PartnerLedgerForm from "./partnerLedger/Form/addEditForm";
import { shallowEqual, useSelector } from "react-redux";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import findIndex from "./../../_helper/_findIndex";
import { SalesReportOMS } from "./../orderManagement/salesReportOMS/index";
import OperationalSetUpBaseAchievement from "./OperationalSetUpBaseAchievementReport/landing";
import AllotmentSalesReport from "./allotmentSalesReport/Table";
import AttachmentUpload from "./attachmentUpload/landing";
import BankGuaranteeReport from "./bankGuaranteeReport/landing";
import ChannelWiseSalesReportLanding from "./channelWiseSales/landing/table";
import CommissionReportAndJV from "./commissionReportAndJV/landing/index";
import CustomerBalanceDaysNLimit from "./customerBalanceDayNLimit/landing/table";
import CustomerCollectionTarget from "./customerCollectionTarget";
import { CustomerCollectionTargetForm } from "./customerCollectionTarget/form/addEditForm";
import CustomerCreditLimitReport from "./customerCreditLimit/landing/table";
import CustomerSalesTarget from "./customerSalesTarget";
import { CustomerSalesTargetForm } from "./customerSalesTarget/form/addEditForm";
import { CustomerSalesTargetViewForm } from "./customerSalesTarget/view/addEditForm";
import CustomerSalesTargetReport from "./customerSalesTargetReport/index";
import { CustomerStatementReport } from "./customerStatement";
import { CustomerStatementModifiedReport } from "./customerStatementModified";
import DeliveryRequestReport from "./deliveryRequestReport/Table/table";
import DeliverySalesPending from "./deliverySalesPending/landing/table";
import FertilizerReportLanding from "./fartilizerReport/landing";
import ItemWiseOrderReport from "./itemWiseOrderReport/landing";
import LoadUnloadBill from "./loadUnloadBill/Table/form";
import ManpowerSalesTargetForm from "./manpowerSalesTarget/form/addEditForm";
import ManpowerSalesTargetTable from "./manpowerSalesTarget/landing/table";
import OrderDetailsReportLanding from "./orderDetailsReport/landing/index";
import PartnerAllotmentReport from "./partnerAllotment/Table/table";
import RetailAndDistributorAchievement from "./retailAndDistAchivment/landing/form";
import SalesCommissionReportLanding from "./salesCommissionReport/landing/table";
import { SalesDetails } from "./salesDetails";
import SalesOrderHistoryLanding from "./salesOrderHistory/landing/form";
import SalesOrderReportLanding from "./salesOrderReport/landing/index";
import SalesReport from "./salesReport";
import SalesReportEssentialTable from "./salesReportEssential/Table/table";
import SalesTrendsAnalysisReportLanding from "./salesTrendAnalysis/landing/table";
import Salesanalytics from "./salesanalytics";
import ShipToPartyDelivery from "./shipToPartyDelivery/Table/table";
import VehicleArrangeInfo from "./vehicleArrangeInfo/landing/table";
import CustomerYearlyAchievement from "./customerYearlyAchievement";
import AllEssentialReport from "./AllEssentialReport";
import ShipToPartyTargetLanding from "./shipToPartyTarget/landing";
import ShipToPartyTargetEntryForm from "./shipToPartyTarget/form/addEditForm";
import SalesKPILanding from "./salesKPI";

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
        component={OperationalSetUpBaseAchievement}
      />

      <ContentRoute
        path="/sales-management/report/RetailAndDistributorIncreaseAchievement"
        component={RetailAndDistributorAchievement}
      />

      <ContentRoute
        from="/sales-management/report/commisionReportAndJv"
        component={CommissionReportAndJV}
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

      <ContentRoute
        path="/sales-management/report/customeryearlyachievement"
        component={CustomerYearlyAchievement}
      />
      <ContentRoute
        path="/sales-management/report/AllEssentialReport"
        component={AllEssentialReport}
      />

      <ContentRoute
        path="/sales-management/report/shiptopartnertarget/entry"
        component={ShipToPartyTargetEntryForm}
      />
      <ContentRoute
        path="/sales-management/report/shiptopartnertarget"
        component={ShipToPartyTargetLanding}
      />

      <ContentRoute
        path="/sales-management/report/SalesKpi"
        component={SalesKPILanding}
      />
    </Switch>
  );
}

export default ReportManagementPages;
