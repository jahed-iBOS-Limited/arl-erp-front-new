import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { ContentRoute } from '../../../../_metronic/layout';
import BusinessPartnerList from './BusinessPartnerList';
import CreateGlobalBank from './GlobalBank/GlobalBankCreate';
import GlobalBankList from './GlobalBank/GlobalBankList';
import CreateMasterBL from './MasterBLConfig/CreateMasterBL';
import MasterBlList from './MasterBLConfig/MasterBlList';

export function ConfigurationPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/cargoManagement"
        to="/cargoManagement/configuration"
      />
      <ContentRoute
        path="/cargoManagement/configuration/assign"
        component={BusinessPartnerList}
      />
      {/* // */}
      <ContentRoute
        path="/cargoManagement/configuration/masterbl/edit/:id"
        component={CreateMasterBL}
      />
      <ContentRoute
        path="/cargoManagement/configuration/masterbl/create"
        component={CreateMasterBL}
      />
      <ContentRoute
        path="/cargoManagement/configuration/masterbl"
        component={MasterBlList}
      />
      {/* // */}
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
