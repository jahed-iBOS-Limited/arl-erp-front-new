import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { ContentRoute } from '../../../../_metronic/layout';
import BusinessPartnerList from './BusinessPartnerList';
import CreateBusinessPartner from './CreateBusinessPartner';
import CreateGlobalBank from './GlobalBank/GlobalBankCreate';
import GlobalBankList from './GlobalBank/GlobalBankList';

export function ConfigurationPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/cargoManagement"
        to="/cargoManagement/configuration"
      />
      <ContentRoute
        path="/cargoManagement/configuration/assign/create"
        component={CreateBusinessPartner}
      />
      <ContentRoute
        path="/cargoManagement/configuration/assign/edit/:id"
        component={CreateBusinessPartner}
      />
      <ContentRoute
        path="/cargoManagement/configuration/assign"
        component={BusinessPartnerList}
      />
      <ContentRoute
        path="/cargoManagement/configuration/globalBank/create"
        component={CreateGlobalBank}
      />
      <ContentRoute
        path="/cargoManagement/configuration/globalBank/edit/:id"
        component={CreateGlobalBank}
      />
      <ContentRoute
        path="/cargoManagement/configuration/globalBank"
        component={GlobalBankList}
      />
    </Switch>
  );
}
export default ConfigurationPages;
