import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
// import CashAtBank from "../../vatManagement/report/registerNew/registerReports/CashAtBank";
// import Customer from "../../vatManagement/report/registerNew/registerReports/Customer";
// import Employee from "../../vatManagement/report/registerNew/registerReports/Employee";
// import InvestmentPartner from "../../vatManagement/report/registerNew/registerReports/InvestmentPartner";
import SubSchedule from "../../vatManagement/report/registerNew/registerReports/SubSchedule";
// import Supplier from "../../vatManagement/report/registerNew/registerReports/Supplier";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import AssetSchedule from "./assetSchedule/table/tableHeader";
// import { AccountPayableAnalysis } from "./accountPayableAnalysis/landing/form";
import AutoReconcile from "./autoReconcile/index";
import BalanceInfoReportLanding from "./balanceInfo/landing/table";

import { BalanceReport } from "./balanceReport/index";
import { BankReconciliationTable } from "./bankReconciliation/Table/table";
import { CashFlowStatement } from "./cashFlowStatement/cashFlowStatement";
import CostOfProduction from "./costOfProduction";
import Incomestatement from "./incomestatement/index";
import ItemBomCost from "./itemBomCost";
import MaterialConsumptionVariance from "./materialConsumptionVariance";
import MaterialPriceVariance from "./materialPriceVariance";
// import { PartnerAccAnalysisLanding } from "./partnerAccAnalysis/landing/form";
import { PartnerLedger } from "./partnerLedger/landing/form";
import AgingReportForAccounts from "./receivableAging";
import Receivableagingsummery from "./receivableagingSummery";
import ResponsibilityCenterwisePerformanceReportRDLC from "./responsibilityCenterwisePerformance/form";
// import { ProfitCenterReport } from "./profitCenterReport/Form/addEditForm";
// import { RegisterReport } from "./register/RegisterReport";
import SubLedgerReport from "./subLedgerReport/index";
import ReportHeader from "./trailBalance/table/tableHeader";
import VatRebateReconciliationRDLCReport from "./vatRebateReconsiliation/vatRebateReconsiliationRDLC";
import ReceiveAndPaymentInfoReport from "./receiceAndPaymentInfo";
import CostVsRevenuePBR from "./costVsRevenue";
import GeneralDashboardPBR from "./generalDashboard";
import InventoryValuationRDLC from "./InventoryValuation";
import IncomeStatementTaxLanding from "./incomeStatementTax";
import ProductionVarianceReport from "./productionVarianceReport";
import DistributionQtyVariance from "./distributionQtyVariance";
import DistributionRateVariance from "./distributionRateVariance";
import UnallocatedProfitCenter from "./unloadProfitCenter";
import TdsVdsStatement from "./TdsVdsStatement";

export function ReportManagmentSystem() {
  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let subSch = null;
  // let cashAtBank = null;
  // let supplier = null;
  // let customer = null;
  // let employee = null;
  // let investmentPartner = null;
  let costOfProductionPermission = null;
  let InventoryValuationRDLCpermission = null;
  //  let costVsRevenueComparisonPermission = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1071) {
      subSch = userRole[i];
    }
    // if (userRole[i]?.intFeatureId === 1072) {
    //   cashAtBank = userRole[i];
    // }
    // if (userRole[i]?.intFeatureId === 1073) {
    //   customer = userRole[i];
    // }
    // if (userRole[i]?.intFeatureId === 1074) {
    //   supplier = userRole[i];
    // }
    // if (userRole[i]?.intFeatureId === 1075) {
    //   employee = userRole[i];
    // }
    // if (userRole[i]?.intFeatureId === 1076) {
    //   investmentPartner = userRole[i];
    // }
    if (userRole[i]?.intFeatureId === 1216) {
      costOfProductionPermission = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1308) {
      InventoryValuationRDLCpermission = userRole[i];
    }
    // if (userRole[i]?.intFeatureId === 1301) {
    //    costVsRevenueComparisonPermission = userRole[i];
    // }
  }

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/financial-management/report"
        to="/financial-management/report/trailbalance"
      />
      {/* <ContentRoute
        from="/financial-management/report/register"
        component={RegisterReport}
      /> */}
      <ContentRoute
        from="/financial-management/report/trailbalance"
        component={ReportHeader}
      />
      {/* Incomestatement report */}
      <ContentRoute
        path="/financial-management/report/incomestatement"
        component={Incomestatement}
      />
      {/* BalanceReport report */}
      <ContentRoute
        path="/financial-management/report/TaxIncomeStatement"
        component={IncomeStatementTaxLanding}
      />
      {/* BalanceReport report */}
      <ContentRoute
        path="/financial-management/report/balancereport"
        component={BalanceReport}
      />
      {/* SubLedgerReport */}
      <ContentRoute
        path="/financial-management/report/subLedgerReport"
        component={SubLedgerReport}
      />

      {/* BankReconciliation */}
      <ContentRoute
        path="/financial-management/report/bankReconciliation"
        component={BankReconciliationTable}
      />
      <ContentRoute
        path="/financial-management/report/cashFlowStatement"
        component={CashFlowStatement}
      />
      <ContentRoute
        path="/financial-management/report/autoReconcile"
        component={AutoReconcile}
      />

      <ContentRoute
        path="/financial-management/report/partnerLedger"
        component={PartnerLedger}
      />

      {/* Balance Info */}
      <ContentRoute
        path="/financial-management/report/balanceinfo"
        component={BalanceInfoReportLanding}
      />
      {/* <ContentRoute
        path="/financial-management/report/profitCenterReport"
        component={ProfitCenterReport}
      /> */}
      {/* Invoice report */}

      {/* Partner Account Analysis */}
      {/* <ContentRoute
        path="/financial-management/report/partnerAccAnalysis"
        component={PartnerAccAnalysisLanding}
      /> */}

      {/* Account Payable Analysis */}
      {/* <ContentRoute
        path="/financial-management/report/partnerAccPayableAnalysis"
        component={AccountPayableAnalysis}
      /> */}
      <ContentRoute
        path="/financial-management/report/assetSchedule"
        component={AssetSchedule}
      />

      <ContentRoute
        from="/financial-management/report/SubScheduleLedger"
        component={subSch?.isView ? SubSchedule : NotPermittedPage}
      />
      {/* <ContentRoute
        from="/financial-management/report/CashAtBankLedger"
        component={cashAtBank?.isView ? CashAtBank : NotPermittedPage}
      /> */}
      {/* <ContentRoute
        from="/financial-management/report/CustomerLedger"
        component={customer?.isView ? Customer : NotPermittedPage}
      /> */}
      {/* <ContentRoute
        from="/financial-management/report/SupplierLedger"
        component={supplier?.isView ? Supplier : NotPermittedPage}
      /> */}
      {/* <ContentRoute
        from="/financial-management/report/EmployeeLedger"
        component={employee?.isView ? Employee : NotPermittedPage}
      /> */}
      {/* <ContentRoute
        from="/financial-management/report/InvestmentPartnerledger"
        component={
          investmentPartner?.isView ? InvestmentPartner : NotPermittedPage
        }
      /> */}

      <ContentRoute
        from="/financial-management/report/receivableaging"
        component={AgingReportForAccounts}
      />
      <ContentRoute
        from="/financial-management/report/VATRebateReconciliation"
        component={VatRebateReconciliationRDLCReport}
      />
      <ContentRoute
        from="/financial-management/report/ProductionVarianceReport"
        component={ProductionVarianceReport}
      />
      <ContentRoute
        from="/financial-management/report/ItemBOMCost"
        component={ItemBomCost}
      />
      <ContentRoute
        from="/financial-management/report/receivableagingsummery"
        component={Receivableagingsummery}
      />
      <ContentRoute
        from="/financial-management/report/MaterialConsumptionVariance"
        component={MaterialConsumptionVariance}
      />
      <ContentRoute
        path="/financial-management/report/MaterialPriceVariance"
        component={MaterialPriceVariance}
      />
      <ContentRoute
        path="/financial-management/report/ResponsibilityCenterwisePerformance"
        component={ResponsibilityCenterwisePerformanceReportRDLC}
      />
      <ContentRoute
        path="/financial-management/report/CostOfProduction"
        component={
          costOfProductionPermission?.isView
            ? CostOfProduction
            : NotPermittedPage
        }
      />

      <ContentRoute
        path="/financial-management/report/receiveandpaymentinfo"
        component={ReceiveAndPaymentInfoReport}
      />

      <ContentRoute
        path="/financial-management/report/CostvsRevenueComparison"
        component={CostVsRevenuePBR}
      />
      <ContentRoute
        path="/financial-management/report/GeneralDashboard"
        component={GeneralDashboardPBR}
      />
      <ContentRoute
        path="/financial-management/report/InventoryValuation"
        component={
          InventoryValuationRDLCpermission?.isView
            ? InventoryValuationRDLC
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/financial-management/report/DistributionQtyVariance"
        component={DistributionQtyVariance}
      />
      <ContentRoute
        path="/financial-management/report/DistributionRateVariance"
        component={DistributionRateVariance}
      />
      <ContentRoute
        path="/financial-management/report/unallocatedprofitcenter"
        component={UnallocatedProfitCenter}
      />
        <ContentRoute
        path="/financial-management/report/tds-vds-statement"
        component={TdsVdsStatement}
      />
    </Switch>
  );
}
