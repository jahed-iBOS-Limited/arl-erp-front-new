import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import ValueAdditionLanding from "./valueAddition";
import ValueAdditionForm from "./valueAddition/Form/addEditForm";
import ValueAdditionViewForm from "./valueAddition/viewForm/addEditForm";
import VatItemForm from "./vatItem/Form/addEditForm";
import VatItemLanding from "./vatItem";
import BsuTaxConfig from "./bsuTaxConfig/bsuTaxConfig";
import { BranchLanding } from "./branch";
import BranchForm from "./branch/Form/addEditForm";
import { PriceSetupLanding } from "./priceSetup";
import PricesetupForm from "./priceSetup/Form/addEditForm";
// import BusinessUnitTaxForm from "./businessUnitTaxInfo/Form/addEditForm";
import VatViewForm from "./vatItem/viewForm/viewForm";
import BusinessPartnerProfileLanding from "./businessPartnerProfile";
import BusinessPartnerProfileForm from "./businessPartnerProfile/Form/addEditForm";
import ExtendCreateForm from "./branch/extend/addEditForm";
import OpeningBalancelLanding from "./openingBalance/Table";
import NotPermittedPage from "./../../_helper/notPermitted/NotPermittedPage";
import findIndex from "./../../_helper/_findIndex";
import ItemBridge from "./itemBridge/table/table";
import { TafsilTable } from "./tafsil/Table/table";
import { TarrifScheduleTable } from "./tarrifSchedule/Table/tarrifScheduleTable";
export function ConfigurationPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const partnerProfile = userRole[184];
  const taxBranch = userRole[findIndex(userRole, "Tax Branch")];
  const buTaxConfig = userRole[findIndex(userRole, "Business Unit Tax Config")];
  const valueAddition = userRole[findIndex(userRole, "Value Addition")];
  const taxItem = userRole[findIndex(userRole, "Tax Item")];
  // const priceSetup = userRole[findIndex(userRole, "Price Setup")];
  const priceSetup = userRole.find((x) => x.intFeatureId === 191);

  return (
    <Switch>
      <Redirect exact={true} from="/configuration" to="/mngVat/cnfg-vat" />

      {/* branch route */}
      <ContentRoute
        path="/mngVat/cnfg-vat/branch/add"
        component={taxBranch?.isCreate ? BranchForm : NotPermittedPage}
      />
      <ContentRoute
        path="/mngVat/cnfg-vat/branch/edit/:id"
        component={taxBranch?.isEdit ? BranchForm : NotPermittedPage}
      />
      <ContentRoute
        path="/mngVat/cnfg-vat/branch/extend/:extendId"
        component={taxBranch?.isCreate ? ExtendCreateForm : NotPermittedPage}
      />
      <ContentRoute path="/mngVat/cnfg-vat/branch" component={BranchLanding} />

      {/* busisness tax config route */}
      <ContentRoute
        path="/mngVat/cnfg-vat/taxConfig"
        component={buTaxConfig?.isCreate ? BsuTaxConfig : NotPermittedPage}
      />
      {/*       <ContentRoute
        path="/mngVat/cnfg-vat/taxConfig"
        component={BusinessUnitTaxForm}
      /> */}

      {/* ValueAdditionLanding routes */}
      <ContentRoute
        path="/mngVat/cnfg-vat/value-addition/edit/:id"
        component={valueAddition?.isEdit ? ValueAdditionForm : NotPermittedPage}
      />

      <ContentRoute
        path="/mngVat/cnfg-vat/value-addition/view/:id"
        component={
          valueAddition?.isView ? ValueAdditionViewForm : NotPermittedPage
        }
      />

      <ContentRoute
        path="/mngVat/cnfg-vat/value-addition/add"
        component={
          valueAddition?.isCreate ? ValueAdditionForm : NotPermittedPage
        }
      />

      <ContentRoute
        path="/mngVat/cnfg-vat/value-addition"
        component={ValueAdditionLanding}
      />
      {/* priceSetup route */}
      <ContentRoute
        path="/mngVat/cnfg-vat/priceSetup/add"
        component={priceSetup?.isCreate ? PricesetupForm : NotPermittedPage}
      />
      <ContentRoute
        path="/mngVat/cnfg-vat/priceSetup/edit/:id"
        component={priceSetup?.isEdit ? PricesetupForm : NotPermittedPage}
      />
      <ContentRoute
        path="/mngVat/cnfg-vat/priceSetup"
        component={PriceSetupLanding}
      />

      {/* Vat-Item routes */}
      <ContentRoute
        path="/mngVat/cnfg-vat/vat-item/edit/:id"
        component={taxItem?.isEdit ? VatItemForm : NotPermittedPage}
      />
      <ContentRoute
        path="/mngVat/cnfg-vat/vat-item/view/:id"
        component={taxItem?.isView ? VatViewForm : NotPermittedPage}
      />
      <ContentRoute
        path="/mngVat/cnfg-vat/vat-item/add"
        component={taxItem?.isCreate ? VatItemForm : NotPermittedPage}
      />

      <ContentRoute
        path="/mngVat/cnfg-vat/vat-item"
        component={VatItemLanding}
      />

      {/* Partner Profile */}
      <ContentRoute
        path="/mngVat/cnfg-vat/cnfg/edit/:id"
        component={
          partnerProfile?.isEdit ? BusinessPartnerProfileForm : NotPermittedPage
        }
      />

      <ContentRoute
        path="/mngVat/cnfg-vat/cnfg/add"
        component={
          partnerProfile?.isCreate
            ? BusinessPartnerProfileForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/mngVat/cnfg-vat/cnfg"
        component={BusinessPartnerProfileLanding}
      />
      <ContentRoute
        path="/mngVat/cnfg-vat/opening-balance"
        component={OpeningBalancelLanding}
      />
      {/* Item Bridge */}
      <ContentRoute path="/mngVat/cnfg-vat/itemBridge" component={ItemBridge} />
      <ContentRoute
        path="/mngVat/cnfg-vat/tarrifSchedule"
        component={TarrifScheduleTable}
      />

      <ContentRoute path="/mngVat/cnfg-vat/tafsil" component={TafsilTable} />
    </Switch>
  );
}
export default ConfigurationPages;
