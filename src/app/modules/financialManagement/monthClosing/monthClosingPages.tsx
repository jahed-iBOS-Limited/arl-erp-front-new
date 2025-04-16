import { Redirect, Switch } from 'react-router-dom';
import { ContentRoute, LayoutSplashScreen } from '../../../../_metronic/layout';
import { lazy, Suspense } from 'react';
const ClearningJournalLandingPage = lazy(
  () => import('./clearingJournal/landing')
);
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
        {/* Clearing Journal */}
        <ContentRoute
          path="/financial-management/MonthClosing/ClearingJournal"
          component={ClearningJournalLandingPage}
        />
      </Switch>
    </Suspense>
  );
};

export default MonthClosingPages;
