import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import findIndex from "./../../_helper/_findIndex";
import EmployeeIncentiveForm from "./EmployeeIncentiveConfig/createEdit.js";
import EmployeeIncentiveLanding from "./EmployeeIncentiveConfig/index.js";
import { DistributionChannel } from "./distributionChannel";
import DistributionChannelForm from "./distributionChannel/Form/addEditForm";
import LoadUnloadBillConfigLanding from "./loadUnloadBillConfig/configItemLoadUnloadBill/loadUnloadBill";
import CreateLoadUnloadBillConfigForm from "./loadUnloadBillConfig/configItemLoadUnloadBill/loadUnloadBill/Form/addEditForm";
import { PartnerThanaRate } from "./partnerThanaRate";
import PartnerThanaRateForm from "./partnerThanaRate/Form/addEditForm";
import ProductDivision from "./productDivision";
import { ProductDivisionAddForm } from "./productDivision/Form/addEditForm";
import { ProductDivisionType } from "./productDivisionType";
import ProductDivisionTypeForm from "./productDivisionType/Form/addEditForm";
import SalesCommissionConfigureEntryForm from "./salesCommissionConfigure/Form/addEditForm";
import SalesCommissionConfigure from "./salesCommissionConfigure/landing";
import SalesConfig from "./salesConfig/salesConfig";
import { SalesOffice } from "./salesOffice";
import SalesOfficeForm from "./salesOffice/Form/addEditForm";
import { SalesOrganization } from "./salesOrganization";
import SalesOrganizationForm from "./salesOrganization/Form/addEditForm";
import SalesTerritory from "./salesTerritory";
import SalesTerritoryForm from "./salesTerritory/Form/addEditForm";
import SalesTerritoryType from "./salesTerritoryType";
import SalesTerritoryTypeForm from "./salesTerritoryType/Form/addEditForm";
import TerritoryInfoLanding from "./territoryInfo/landing/table";
import TerritorySetupLanding from "./territoryInfo/territorySetup/landing/table";
import { TerritorySalesForceConfig } from "./territorySalesforceConfig";
import TerritorySalesForceConfigForm from "./territorySalesforceConfig/Form/addEditForm";
import { TransportRoute } from "./transportRoute";
import TransportRouteForm from "./transportRoute/Form/addEditForm";
import { TransportZone } from "./transportZone.js";
import TransportZoneForm from "./transportZone.js/Form/addEditForm";
import ComplainAssignConfigCreateEdit from "../complainManagement/complaintAssignConfig/addEditForm.js";
import ComplainAssignConfigLanding from "../complainManagement/complaintAssignConfig/index.js";

export function SalesConfigurationPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const salesOrganization = userRole[findIndex(userRole, "Sales Organization")];
  const salesOffice = userRole[findIndex(userRole, "Sales Office")];
  const distributionChannel =
    userRole[findIndex(userRole, "Distribution Channel")];
  const productDivision = userRole[findIndex(userRole, "Product Division")];
  const productDivisionType =
    userRole[findIndex(userRole, "Product Division Type")];
  const salesTerritory = userRole[findIndex(userRole, "Sales Territory")];
  const salesTerritoryType =
    userRole[findIndex(userRole, "Sales Territory Type")];
  const salesConfig = userRole[findIndex(userRole, "Sales Config")];
  const partnerThanaRate = userRole[findIndex(userRole, "Partner Thana Rate")];
  const loadUnloadBillConfig =
    userRole[findIndex(userRole, "Load Unload Bill Config")];
  const terrytorySalesForceConfig =
    userRole[findIndex(userRole, "Territory SalesForce Config")];

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/sales-management/configuration"
        to="/sales-management/configuration/salesorganization"
      />

      {/* sales organization  */}
      <ContentRoute
        from="/sales-management/configuration/salesorganization/add"
        component={
          salesOrganization?.isCreate ? SalesOrganizationForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/sales-management/configuration/salesorganization/extend/:id"
        component={
          salesOrganization?.isCreate ? SalesOrganizationForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/sales-management/configuration/salesorganization"
        component={SalesOrganization}
      />

      {/* sales config  */}
      <ContentRoute
        from="/sales-management/configuration/salesConfig"
        component={salesConfig?.isCreate ? SalesConfig : NotPermittedPage}
      />

      {/* Product division routes */}
      <ContentRoute
        from="/sales-management/configuration/productdivision/edit/:id"
        component={
          productDivision?.isEdit ? ProductDivisionAddForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/sales-management/configuration/productdivision/add"
        component={
          productDivision?.isCreate ? ProductDivisionAddForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/sales-management/configuration/productdivision"
        component={ProductDivision}
      />

      {/* Product division type routes */}
      <ContentRoute
        from="/sales-management/configuration/product_divisiontype/add"
        component={
          productDivisionType?.isCreate
            ? ProductDivisionTypeForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/sales-management/configuration/product_divisiontype/edit/:id"
        component={
          productDivisionType?.isEdit
            ? ProductDivisionTypeForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/sales-management/configuration/product_divisiontype"
        component={ProductDivisionType}
      />

      {/* Sales Territory */}
      <ContentRoute
        from="/sales-management/configuration/salesterritory/add"
        component={
          salesTerritory?.isCreate ? SalesTerritoryForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/sales-management/configuration/salesterritory/edit/:id"
        component={
          salesTerritory?.isEdit ? SalesTerritoryForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/sales-management/configuration/salesterritory"
        component={SalesTerritory}
      />

      {/* Sales territory type */}
      <ContentRoute
        from="/sales-management/configuration/sales_territorytype/add"
        component={
          salesTerritoryType?.isCreate
            ? SalesTerritoryTypeForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/sales-management/configuration/sales_territorytype/edit/:id"
        component={
          salesTerritoryType?.isEdit ? SalesTerritoryTypeForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/sales-management/configuration/sales_territorytype"
        component={SalesTerritoryType}
      />

      {/* All Transport Route */}
      <ContentRoute
        from="/sales-management/configuration/transportroute/add"
        component={TransportRouteForm}
      />
      <ContentRoute
        from="/sales-management/configuration/transportroute/extend/:id"
        component={TransportRouteForm}
      />
      <ContentRoute
        from="/sales-management/configuration/transportroute"
        component={TransportRoute}
      />

      {/* All SalesOffice Route */}
      <ContentRoute
        from="/sales-management/configuration/salesoffice/edit/:id"
        component={salesOffice?.isEdit ? SalesOfficeForm : NotPermittedPage}
      />
      <ContentRoute
        from="/sales-management/configuration/salesoffice/add"
        component={salesOffice?.isCreate ? SalesOfficeForm : NotPermittedPage}
      />
      <ContentRoute
        from="/sales-management/configuration/salesoffice"
        component={SalesOffice}
      />

      {/* All DistributionChannel Route */}
      <ContentRoute
        from="/sales-management/configuration/distributionchannel/edit/:id"
        component={
          distributionChannel?.isEdit
            ? DistributionChannelForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/sales-management/configuration/distributionchannel/add"
        component={
          distributionChannel?.isCreate
            ? DistributionChannelForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/sales-management/configuration/distributionchannel"
        component={DistributionChannel}
      />

      {/* All Partner Thana Rate Route */}
      <ContentRoute
        from="/sales-management/configuration/partnerThanaRate/edit/:id"
        component={
          partnerThanaRate?.isEdit ? PartnerThanaRateForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/sales-management/configuration/partnerThanaRate/add"
        component={
          partnerThanaRate?.isCreate ? PartnerThanaRateForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/sales-management/configuration/partnerThanaRate"
        component={PartnerThanaRate}
      />

      {/* Territory Salesforce Config */}
      <ContentRoute
        from="/sales-management/configuration/territorysalesforceconfig/add"
        component={
          terrytorySalesForceConfig?.isCreate
            ? TerritorySalesForceConfigForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/sales-management/configuration/territorysalesforceconfig/edit/:id"
        component={
          terrytorySalesForceConfig?.isEdit
            ? TerritorySalesForceConfigForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/sales-management/configuration/territorysalesforceconfig"
        component={TerritorySalesForceConfig}
      />
      {/* transport zone */}
      <ContentRoute
        from="/sales-management/configuration/transportzone/edit/:id"
        component={TransportZoneForm}
      />
      <ContentRoute
        from="/sales-management/configuration/transportzone/add"
        component={TransportZoneForm}
      />
      <ContentRoute
        from="/sales-management/configuration/transportzone"
        component={TransportZone}
      />
      {/* Load unload Bill Config */}
      <ContentRoute
        from="/sales-management/configuration/loadunloadbillconfig/edit/:id"
        component={
          loadUnloadBillConfig?.isEdit
            ? CreateLoadUnloadBillConfigForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/sales-management/configuration/loadunloadbillconfig/add"
        component={
          loadUnloadBillConfig?.isCreate
            ? CreateLoadUnloadBillConfigForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/sales-management/configuration/loadunloadbillconfig"
        component={LoadUnloadBillConfigLanding}
      />
      <ContentRoute
        from="/sales-management/configuration/territoryInfo/crate"
        component={TerritorySetupLanding}
      />
      <ContentRoute
        from="/sales-management/configuration/territoryInfo"
        component={TerritoryInfoLanding}
      />

      <ContentRoute
        from="/sales-management/configuration/salescommissionconfigure/entry"
        component={SalesCommissionConfigureEntryForm}
      />
      <ContentRoute
        from="/sales-management/configuration/salescommissionconfigure"
        component={SalesCommissionConfigure}
      />
      <ContentRoute
        from="/sales-management/configuration/EmployeeIncentiveConfig/edit/:id"
        component={EmployeeIncentiveForm}
      />
      <ContentRoute
        from="/sales-management/configuration/EmployeeIncentiveConfig/create"
        component={EmployeeIncentiveForm}
      />
      <ContentRoute
        from="/sales-management/configuration/EmployeeIncentiveConfig"
        component={EmployeeIncentiveLanding}
      />
      <ContentRoute
        from="/sales-management/configuration/complaintassignconfig/create"
        component={ComplainAssignConfigCreateEdit}
      />
      <ContentRoute
        from="/sales-management/configuration/complaintassignconfig/edit/:id"
        component={ComplainAssignConfigCreateEdit}
      />
      <ContentRoute
        from="/sales-management/configuration/complaintassignconfig"
        component={ComplainAssignConfigLanding}
      />
    </Switch>
  );
}
