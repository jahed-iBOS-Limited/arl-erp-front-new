import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { LayoutSplashScreen, ContentRoute } from '../../../_metronic/layout';
import { Suspense } from 'react';
import SalesPage from './sales/salesPage';
import reportPages from './report/reportPages';
import FinancialPages from './financial/financialPages';

export function VatManagementPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect exact={true} from="/mngVat" to="/mngVat/cnfg-vat/cnfg" />
        {/* Sales route */}
        <ContentRoute path="/mngVat/sales" component={SalesPage} />
        {/* Report */}
        <ContentRoute path="/mngVat/report" component={reportPages} />
        {/* Financial */}
        <ContentRoute path="/mngVat/tax-financial" component={FinancialPages} />
      </Switch>
    </Suspense>
  );
}
export default VatManagementPages;
