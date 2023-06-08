import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { Suspense } from "react";
import ItemProfileForm from "./itemProfile/form/addEditForm";
import CustomerPoint from "./customerPoint/customerPoint";
import ItemGroupForPrivilege from "./itemGroupForPrivilege/landing";
import ItemGroupForPrivilegeForm from "./itemGroupForPrivilege/Form/addEditForm";
import CustomerGroupForPrivilege from "./customerGroupForPrivilege/landing";
import CustomerGroupForPrivilegeForm from "./customerGroupForPrivilege/Form/addEditForm";
import PrivilegeSchemeLanding from "./customerPrivilegeScheme/landing";
import CustomerPrivilegeSchemeForm from "./customerPrivilegeScheme/Form/addEditForm";
import WalletSetupForm from "./walletSetup/form/addEditForm";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import { shallowEqual, useSelector } from "react-redux";

export function ConfigurationPages() {
  const { userRole } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  let updateSalesRate = null;
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 862) {
      updateSalesRate = userRole[i];
    }
  }

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/pos-management"
          to="/pos-management/configaration"
        />

        {/*  item Profile routes*/}
        <ContentRoute
          path="/pos-management/configuration/itemProfile"
          component={
            updateSalesRate?.isCreate ? ItemProfileForm : NotPermittedPage
          }
        />
        <ContentRoute
          path="/pos-management/configuration/customerPoint"
          component={CustomerPoint}
        />
        {/* ItemGroup For Privilege routes */}
        <ContentRoute
          path="/pos-management/configuration/itemGroupForPrivilege/create"
          component={ItemGroupForPrivilegeForm}
        />
        <ContentRoute
          path="/pos-management/configuration/itemGroupForPrivilege"
          component={ItemGroupForPrivilege}
        />
        {/* CustomerGroup For Privilege routes*/}
        <ContentRoute
          path="/pos-management/configuration/customerGroupForPrivilege/create"
          component={CustomerGroupForPrivilegeForm}
        />
        <ContentRoute
          path="/pos-management/configuration/customerGroupForPrivilege"
          component={CustomerGroupForPrivilege}
        />
        {/*  Customer Privilege Scheme routes*/}
        <ContentRoute
          path="/pos-management/configuration/setupPrivilegeScheme/create"
          component={CustomerPrivilegeSchemeForm}
        />
        <ContentRoute
          path="/pos-management/configuration/setupPrivilegeScheme"
          component={PrivilegeSchemeLanding}
        />

        <ContentRoute
          path="/pos-management/configuration/wallet"
          component={WalletSetupForm}
        />
      </Switch>
    </Suspense>
  );
}

export default ConfigurationPages;
