import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import { BillBySupplier } from "./billbysupplier";
import { PRReport } from "./indentStatement/index";
import { PORegisterReport } from "./PoRegister";
import { POReport } from "./PoStatement";
import POPRGRNTable from "./PrPOGrn/Table/table";
import { PartnerLedger } from "./partnerLedger/index";
import ProcureToPayReportTable  from "./procureToPay/index";
import { PurchaseInfoLanding } from './purchaseInfo/Table/tableHeader';

export function ReportsPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/mngProcurement/report"
        to="/mngProcurement/report"
      />

      {/* Indent Statement */}
      <ContentRoute
        from="/mngProcurement/report/indent-statement"
        component={PRReport}
      />

      {/* PO Statement */}
      <ContentRoute
        from="/mngProcurement/report/po-statement"
        component={POReport}
      />

      {/* PO Register */}
      <ContentRoute
        from="/mngProcurement/report/po-register"
        component={PORegisterReport}
      />

      {/* PO Register */}
      <ContentRoute
        from="/mngProcurement/report/pr-po-grn"
        component={POPRGRNTable}
      />

      {/* Bill By supplier */}
      <ContentRoute
        from="/mngProcurement/report/bill-by-supplier"
        component={BillBySupplier}
      />

      {/* Partner Ledger */}
      <ContentRoute
        path="/mngProcurement/report/partnerLedger"
        component={PartnerLedger}
      />
      <ContentRoute
        from="/mngProcurement/report/procure-to-pay"
        component={ProcureToPayReportTable}
      />
      {/* partner info */}
      <ContentRoute
        path="/mngProcurement/report/partner-info"
        component={PurchaseInfoLanding}
      />
    </Switch>
  );
}
