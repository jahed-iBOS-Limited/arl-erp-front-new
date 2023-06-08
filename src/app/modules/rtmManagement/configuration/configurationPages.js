import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import { OutletAttributeLanding } from "./outletAttribute";
import OutletAttributeForm from "./outletAttribute/Form/addEditForm";
import { RouteLanding } from "./route";
import RouteForm from "./route/Form/addEditForm";

import OutletBusinessTypeForm from "./outletType/form/addEditForm";
import OutletBusinessTypeLanding from "./outletType/landing/table";
import BeatForm from "./beat/form/addEditForm";

import OutlateProfileFrom from "./outlateProfile/Form/addEditForm";
// import OutlateProfileFrom from "./outlateProfile/form/addEditForm";
// import OutlateForm from "./outlateProfile/form/addEditForm";
import { OutlateProfileLanding } from "./outlateProfile/Table/tableHeader";
import { RoutePlanConfigLanding } from "./routePlanConfig/Table/tableHeader";
import RouteSetupConfigForm from "./routePlanConfig/Form/addEditForm";
import { SalesTargetConfig } from "./salesTargetConfig/Table/tableHeader";
import SalesTargetConfigForm from "./salesTargetConfig/Form/addEditForm";
import ViewOutletProfile from "./outlateProfile/view/addEditForm";
import OutlateProfileEditFrom from "./outlateProfile/Edit/addEditForm";

// import { OutlateProfileLanding } from "./outlateProfile/table/tableHeader";
import RetailPriceLanding from "./retailPrice/landing/table";
import RetailPriceForm from "./retailPrice/form/addEditForm";
import { EmpGroupTable } from "./empGroup/Table/tableHeader";
import EmpGroupCreateForm from "./empGroup/Form/addEditForm";
import EmpGroupExtendCreateForm from "./empGroup/extendEmpGroup/addEditForm";
import DamageCategoryLanding from "./damageCategory/landing/table";
import DamageCategoryForm from "./damageCategory/form/addEditForm";
import BeatLanding from "./beat/Table/index";
import OutletSurveyLanding from "./outletSurvey/landing/table";
import OutletSurveyForm from "./outletSurvey/form/addEditForm";
import EmployeeGroupViewForm from "./empGroup/View/viewModal";
import RTMCalendarSetup from "./calendarSetup/form/addEditForm";
import SalescalendarSetupForm from "./salesCalenderSetup/Form/addEditForm";
import MarketSetupTable from "./marketSetupNew/landing/tableRow"

//

export function ConfigurationPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/configuration"
        to="/rtm-management/configuration"
      />

      {/* route */}

      {/* Outlet Attribute */}
      <ContentRoute
        path="/rtm-management/configuration/outletAttribute/edit/:id"
        component={OutletAttributeForm}
      />
      <ContentRoute
        path="/rtm-management/configuration/outletAttribute/add"
        component={OutletAttributeForm}
      />
      <ContentRoute
        path="/rtm-management/configuration/outletAttribute"
        component={OutletAttributeLanding}
      />
      {/* Outlet Type */}
      <ContentRoute
        path="/rtm-management/configuration/outletType/edit/:id"
        component={OutletBusinessTypeForm}
      />
      <ContentRoute
        path="/rtm-management/configuration/outletType/create"
        component={OutletBusinessTypeForm}
      />
      <ContentRoute
        path="/rtm-management/configuration/outletType"
        component={OutletBusinessTypeLanding}
      />

      <Redirect
        exact={true}
        from="/configuration"
        to="/rtm-management/configuration"
      />

      {/* Beat */}
      <ContentRoute
        path="/rtm-management/configuration/beat/edit/:id"
        component={BeatForm}
      />
      <ContentRoute
        path="/rtm-management/configuration/beat/create"
        component={BeatForm}
      />
      <ContentRoute
        path="/rtm-management/configuration/beat"
        component={BeatLanding}
      />
      {/* route */}
      <ContentRoute
        path="/rtm-management/configuration/route/edit/:id"
        component={RouteForm}
      />
      {/* <ContentRoute
        path="/rtm-management/configuration/route/add"
        component={RouteForm}
      /> */}

      <ContentRoute
        path="/rtm-management/configuration/route/add"
        component={RouteForm}
      />
      <ContentRoute
        path="/rtm-management/configuration/route"
        component={RouteLanding}
      />
      {/* <ContentRoute
        path="/rtm-management/configuration/create"
        component={RouteLanding}
      /> */}

      {/* OurlateProfile */}
      <ContentRoute
        path="/rtm-management/configuration/outletProfile/View/:id"
        component={ViewOutletProfile}
      />
      <ContentRoute
        path="/rtm-management/configuration/outletProfile/edit/:id"
        component={OutlateProfileEditFrom}
      />
      <ContentRoute
        path="/rtm-management/configuration/outletProfile/create"
        component={OutlateProfileFrom}
      />
      <ContentRoute
        path="/rtm-management/configuration/outletProfile"
        component={OutlateProfileLanding}
      />

      {/* Route Plan Config */}
      <ContentRoute
        path="/rtm-management/configuration/routePlanConfig/edit/:id"
        component={RouteSetupConfigForm}
      />
      <ContentRoute
        path="/rtm-management/configuration/routePlanConfig/create"
        component={RouteSetupConfigForm}
      />
      <ContentRoute
        path="/rtm-management/configuration/routePlanConfig"
        component={RoutePlanConfigLanding}
      />

      {/* Slaes Target Config */}
      <ContentRoute
        path="/rtm-management/configuration/salesTargetConfig/edit/:id"
        component={SalesTargetConfigForm}
      />
      <ContentRoute
        path="/rtm-management/configuration/salesTargetConfig/create"
        component={SalesTargetConfigForm}
      />
      <ContentRoute
        path="/rtm-management/configuration/salesTargetConfig"
        component={SalesTargetConfig}
      />

      {/* Retail Price */}
      <ContentRoute
        path="/rtm-management/configuration/itemRate/edit/:id"
        component={RetailPriceForm}
      />
      <ContentRoute
        path="/rtm-management/configuration/itemRate/create"
        component={RetailPriceForm}
      />
      <ContentRoute
        path="/rtm-management/configuration/itemRate"
        component={RetailPriceLanding}
      />

      {/* Employee Group */}
      <ContentRoute
        path="/rtm-management/configuration/employeeGroup/view/:id"
        component={EmployeeGroupViewForm}
      />
      <ContentRoute
        path="/rtm-management/configuration/employeeGroup/extendEmpGroup"
        component={EmpGroupExtendCreateForm}
      />
      <ContentRoute
        path="/rtm-management/configuration/employeeGroup/create"
        component={EmpGroupCreateForm}
      />
      <ContentRoute
        path="/rtm-management/configuration/employeeGroup"
        component={EmpGroupTable}
      />

      {/* Damage Category */}
      <ContentRoute
        path="/rtm-management/configuration/damageCategory/edit/:id"
        component={DamageCategoryForm}
      />
      <ContentRoute
        path="/rtm-management/configuration/damageCategory/view/:view"
        component={DamageCategoryForm}
      />
      <ContentRoute
        path="/rtm-management/configuration/damageCategory/create"
        component={DamageCategoryForm}
      />
      <ContentRoute
        path="/rtm-management/configuration/damageCategory"
        component={DamageCategoryLanding}
      />

      {/* Outlet Survey */}
      <ContentRoute
        path="/rtm-management/configuration/outletsurvey/view/:viewId"
        component={OutletSurveyForm}
      />
      <ContentRoute
        path="/rtm-management/configuration/outletsurvey/create"
        component={OutletSurveyForm}
      />
      <ContentRoute
        path="/rtm-management/configuration/outletsurvey"
        component={OutletSurveyLanding}
      />

      {/* Calendar Setup */}
      <ContentRoute
        path="/rtm-management/configuration/calendarsetup"
        component={RTMCalendarSetup}
      />

      {/* Sales Calendar Setup */}
      <ContentRoute
        path="/rtm-management/configuration/salesCalendarsetup"
        component={SalescalendarSetupForm}
      />
      <ContentRoute
        path="/rtm-management/configuration/marketSetupNew"
        component={MarketSetupTable}
      />
    </Switch>
  );
}
export default ConfigurationPages;
