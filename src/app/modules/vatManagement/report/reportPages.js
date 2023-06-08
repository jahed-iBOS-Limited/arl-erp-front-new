import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import reportLanding from ".";
import { ContentRoute } from "../../../../_metronic/layout";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import MushakSixPointSixLanding from "./6.6/landing/tableHeader";
import MushakSevenPointOneLanding from "./7.1/landing/index";
import AuditLogLanding from "./auditLog/Table/index";
import AuditReport from "./auditReport/Table/card/index";
import AuditReportLanding from "./auditReport/Table/index";
import { BalanceReport } from "./balanceReport";
import { CashFlowStatement } from "./cashFlowStatement/cashFlowStatement";
import CreditNoteLanding from "./creditNote/Table";
import DebitNoteLanding from "./debitNote/Table";
import Incomestatement from "./incomestatement";
import InventoryRegisterLanding from "./inventoryRegister";
import IssueSummaryLanding from "./issueSummery/Table";
import MushakSixPointOneLanding from "./mushak6.1/landing";
import MushakLanding from "./mushak9.1/Table";
import ProductionSummaryLanding from "./productionSummery/Table";
import PurchaseRegLanding from "./purchaseReg/Table/index";
import PurchaseSalesLanding from "./purchaseSales/Table/index";
import PurchaseSummeryLanding from "./purchasSesummery/Table";
import { RegisterReport } from "./register/RegisterReport";
import CashAtBank from "./registerNew/registerReports/CashAtBank";
import Customer from "./registerNew/registerReports/Customer";
import Employee from "./registerNew/registerReports/Employee";
import InvestmentPartner from "./registerNew/registerReports/InvestmentPartner";
import Supplier from "./registerNew/registerReports/Supplier";
import SalesInformationLanding from "./salesInformation/Table";
import SalesRegisterLanding from "./salesRegister/Table";
import SalesSummeryLanding from "./salesSummary/Table/index";
import TaxLedgerLanding from "./taxLedger/Table";
import ReportHeader from "./trailBalance/table/tableHeader";
import TreasurydepositsummaryLanding from "./treasuryDepositSummary/Table";
import VatPivoteTableReportLanding from "./vatPivoteTableReport/landing/index";
import { AccountJournelNotesReport } from "./accountJournelNotesReport";

export function ReportPages() {

  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  // let subSch = null;
  let cashAtBank = null;
  let supplier = null;
  let customer = null;
  let employee = null;
  let investmentPartner = null;
  let accountJournelNotesReport = null;
  // let costOfProductionPermission = null;

  for (let i = 0; i < userRole.length; i++) {
    // if (userRole[i]?.intFeatureId === 1071) {
    //   subSch = userRole[i];
    // }
    if (userRole[i]?.intFeatureId === 1072) {
      cashAtBank = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1073) {
      customer = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1074) {
      supplier = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1075) {
      employee = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1076) {
      investmentPartner = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1283) {
      accountJournelNotesReport = userRole[i];
    }
    // if (userRole[i]?.intFeatureId === 1216) {
    //   costOfProductionPermission = userRole[i];
    // }
  }

  return (
    <Switch>
      <Redirect exact={true} from="/report" to="/mngVat/report" />
      {/* salesBook - 6.2 route */}
      {/* <ContentRoute
        path="/mngVat/cnfg-vat/business-partner-profile/create"
        component={TransferOutCreateForm}
      /> */}
      <ContentRoute path="/mngVat/report/salesbook" component={reportLanding} />
      {/* Purchase Registration route */}
      <ContentRoute
        path="/mngVat/report/purchasereg"
        component={PurchaseRegLanding}
      />

      {/* Sales Information route */}
      <ContentRoute
        path="/mngVat/report/salesinfo"
        component={SalesInformationLanding}
      />
      <ContentRoute
        path="/mngVat/report/salesreg"
        component={SalesRegisterLanding}
      />
      {/* Purchase Sales */}
      <ContentRoute
        path="/mngVat/report/purchasesalesreg"
        component={PurchaseSalesLanding}
      />
      {/* Issue Summary */}
      <ContentRoute
        path="/mngVat/report/issuesummery"
        component={IssueSummaryLanding}
      />
      {/* Production Summary */}
      <ContentRoute
        path="/mngVat/report/productionsummery"
        component={ProductionSummaryLanding}
      />
      {/* Production Summary */}
      <ContentRoute
        path="/mngVat/report/purchasesummery"
        component={PurchaseSummeryLanding}
      />
      {/* Sales Summary */}
      <ContentRoute
        path="/mngVat/report/salessummery"
        component={SalesSummeryLanding}
      />
      {/* Treasury Deposit Summary */}
      <ContentRoute
        path="/mngVat/report/treasurydepositsummary"
        component={TreasurydepositsummaryLanding}
      />
      {/* Credit Note Report*/}
      <ContentRoute
        path="/mngVat/report/creditnote"
        component={CreditNoteLanding}
      />
      {/* Debit Note Report*/}
      <ContentRoute
        path="/mngVat/report/debitnote"
        component={DebitNoteLanding}
      />

      {/* Mushak 9.1 Report */}
      <ContentRoute path="/mngVat/report/mushak9.1" component={MushakLanding} />

      {/* Mushak 7.1 Report */}
      <ContentRoute
        path="/mngVat/report/7.1"
        component={MushakSevenPointOneLanding}
      />

      {/* Mushak 6.6 Report */}
      <ContentRoute
        path="/mngVat/report/6.6"
        component={MushakSixPointSixLanding}
      />

      {/* Pivote Table Report */}
      <ContentRoute
        path="/mngVat/report/pivotreport"
        component={VatPivoteTableReportLanding}
      />

      {/* Tax Ledger Report*/}
      <ContentRoute
        path="/mngVat/report/taxledger"
        component={TaxLedgerLanding}
      />

      {/* Inventory Register Report*/}
      <ContentRoute
        path="/mngVat/report/inv-report"
        component={InventoryRegisterLanding}
      />

      {/* Mushak 6.1 */}
      <ContentRoute
        path="/mngVat/report/mushak6.10"
        component={MushakSixPointOneLanding}
      />
      <ContentRoute
        path="/mngVat/report/balanceSheet"
        component={BalanceReport}
      />
      <ContentRoute
        from="/mngVat/report/trialBalance"
        component={ReportHeader}
      />
      <ContentRoute
        path="/mngVat/report/cashflowStatement"
        component={CashFlowStatement}
      />
      <ContentRoute
        path="/mngVat/report/incomeSatement"
        component={Incomestatement}
      />
      <ContentRoute from="/mngVat/report/register" component={RegisterReport} />
      {/* Transaction Log route */}
      <ContentRoute
        from="/mngVat/report/auditLog"
        component={AuditLogLanding}
      />
      {/* Audit Report */}
      <ContentRoute
        path="/mngVat/report/auditReport/view"
        component={AuditReportLanding}
      />
      <ContentRoute path="/mngVat/report/auditReport" component={AuditReport} /> 
      <ContentRoute path="/mngVat/report/notesReport" component={accountJournelNotesReport?.isView ? AccountJournelNotesReport : NotPermittedPage} /> 

      <ContentRoute
        from="/mngVat/report/CashAtBankLedger"
        component={cashAtBank?.isView ? CashAtBank : NotPermittedPage}
      />
      <ContentRoute
        from="/mngVat/report/CustomerLedger"
        component={customer?.isView ? Customer : NotPermittedPage}
      />
      <ContentRoute
        from="/mngVat/report/SupplierLedger"
        component={supplier?.isView ? Supplier : NotPermittedPage}
      />
      <ContentRoute
        from="/mngVat/report/EmployeeLedger"
        component={employee?.isView ? Employee : NotPermittedPage}
      />
      <ContentRoute
        from="/mngVat/report/InvestmentPartnerledger"
        component={
          investmentPartner?.isView ? InvestmentPartner : NotPermittedPage
        }
      />
    </Switch>
  );
}
export default ReportPages;
