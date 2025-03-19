import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { ContentRoute } from '../../../../_metronic/layout';
import CDPRreportLanding from './CDPRreport/landing';
import MarketCompetitorPrice from './marketCompetitorPrice/create';
import MarketCompetitorPriceLanding from './marketCompetitorPrice/landing';

export function CRMPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/sales-management/CRM"
        to="/sales-management/CRM/MarketCompetitorPrice"
      />
      <ContentRoute
        from="/sales-management/CRM/MarketCompetitorPrice/edit/:id"
        component={MarketCompetitorPrice}
      />
      <ContentRoute
        from="/sales-management/CRM/MarketCompetitorPrice/entry"
        component={MarketCompetitorPrice}
      />
      <ContentRoute
        from="/sales-management/CRM/MarketCompetitorPrice"
        component={MarketCompetitorPriceLanding}
      />
      <ContentRoute
        from="/sales-management/CRM/CDPRreport"
        component={CDPRreportLanding}
      />
    </Switch>
  );
}
