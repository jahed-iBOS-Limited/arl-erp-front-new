import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../_metronic/layout";
import { Suspense } from "react";
import ConfigurationPages from "./configuration/configurationPages";
import VoucherPages from "./voucher/voucherPages";
import PurchasePages from "./purchase/purchasePages";
import InventoryPages from "./inventory/inventoryPages";
import TransactionPages from "./transaction/transactionPages";
import { OtherAdjustmentPages } from "./otherAdjustment/otherAdjustmentPages";
import SalesPage from "./sales/salesPage";
import reportPages from "./report/reportPages";
import Dashboard from "./dashboard";
import { TrunOverTaxLanding } from "./trunOverTax/Table/tableHeader";
import FinancialPages from "./financial/financialPages";

export function VatManagementPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <ContentRoute path="/mngVat/cnfg-vat/dashboard" component={Dashboard} />
      <Switch>
        <Redirect exact={true} from="/mngVat" to="/mngVat/cnfg-vat/cnfg" />
        {/* <ContentRoute exact path="/mngVat/transaction" component={TransactionPages} /> */}

        <ContentRoute path="/mngVat/cnfg-vat" component={ConfigurationPages} />

        <ContentRoute path="/mngVat/purchase" component={PurchasePages} />
        {/*  */}
        <ContentRoute path="/mngVat/voucher" component={VoucherPages} />
        {/* inventory route */}
        <ContentRoute path="/mngVat/inventory" component={InventoryPages} />
        {/* transaction route */}
        <ContentRoute path="/mngVat/transaction" component={TransactionPages} />
        {/* TransactionPages */}
        <ContentRoute path="/mngVat/voucher" component={VoucherPages} />

        {/* <ContentRoute
          path="/sales-management/configuration"
          component={SalesConfigurationPages}
        /> */}

        <ContentRoute path="/mngVat/purchase" component={PurchasePages} />

        {/* Inventory route */}
        <ContentRoute path="/mngVat/inventory" component={InventoryPages} />

        {/* OTHER ADJUSTMENT ROUTE */}
        <ContentRoute
          path="/mngVat/otherAdjustment"
          component={OtherAdjustmentPages}
        />
        {/* Sales route */}

        <ContentRoute path="/mngVat/sales" component={SalesPage} />

        {/* Report */}
        <ContentRoute path="/mngVat/report" component={reportPages} />

        {/* Report */}
        <ContentRoute
          path="/mngVat/turnoverTax"
          component={TrunOverTaxLanding}
        />

        {/* Financial */}
        <ContentRoute path="/mngVat/tax-financial" component={FinancialPages} />
      </Switch>
    </Suspense>
  );
}
export default VatManagementPages;
