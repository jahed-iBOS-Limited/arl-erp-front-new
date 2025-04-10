import { Redirect, Switch } from 'react-router-dom';
import { ContentRoute, LayoutSplashScreen } from '../../../../_metronic/layout';
import { lazy, Suspense } from 'react';
const ReconciliationJournal = lazy(
  () => import('../financials/reconciliationJournal/table/tableHeader')
);

const MonthClosingPages = () => {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/financial-management/MonthClosing"
          to="/financial-management/MonthClosing/MonthEndJournal"
        />
        <ContentRoute
          path="/financial-management/MonthClosing/MonthEndJournal"
          component={ReconciliationJournal}
        />
      </Switch>
    </Suspense>
  );
};

export default MonthClosingPages;
