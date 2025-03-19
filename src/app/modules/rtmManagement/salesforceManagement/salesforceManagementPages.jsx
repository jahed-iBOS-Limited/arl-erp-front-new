import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
// import { RouteSetupLanding } from "./routeSetup";
// import SalesForceInfoForm from './salesforceBasicInformation/form/addEditForm'
// import SalesForceInfoLanding from './salesforceBasicInformation/landing/table'
import { RouteSetupLanding } from "./routeSetup";
import RouteSetupForm from "./routeSetup/Form/addEditForm";
// import SalesForceInfoViewForm from './salesforceBasicInformation/view/addEditForm'
import { SalesforceTransferLanding } from "./salesforceTransfer";
import SalesforceTranferForm from "./salesforceTransfer/Form/addEditForm";
import RouteSetupViewForm from "./routeSetup/View/addEditForm";
import { SalesForceFixedTaDALanding } from "./salesforceFixedTaDa/Table/tableHeader";
import SalesForceFixedTaDAForm from "./salesforceFixedTaDa/Form/addEditForm";
import ViewSalesForceFixedTaDA from "./salesforceFixedTaDa/View/addEditForm";
import RouteSetupApproveForm from "./routeSetup/Approve/addEditForm";
import SalesOfficialInfoCollapsePanel from "./salesforcebasic/officialInformation/EditForm/mainCollapse";

import SalesTargetSetupForm from "./salesTarget/form/addEditForm";
// import SalesForceInfoForm from "./salesforceBasicInformation/form/addEditForm";
// import SalesForceInfoLanding from "./salesforceBasicInformation/landing/table";
import SalesForceInfoViewForm from "./salesforceBasicInformation/view/addEditForm";
import SalesForceInfoEditForm from "./salesforceBasicInformation/edit/addEditForm";
import AssetAllocationLanding from "./assetAllocation/landing/table";
import SalesBasicInformationlLanding from "./salesforcebasic/Table";
import SalesForceElmployeeInformationForm from "./salesforcebasic/Form/addEditForm";
import SalesforceMonthlyTaDa from "./saleForceMonthlyTaDa/Form/AddEditForm";
import BulkSalesTargetSetup from "./bulkSalesTargetSetup/landing/table";

export function SalesforcePages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/salesforceManagement"
        to="/rtm-management/salesforceManagement"
      />

      {/* Salesforce Information */}
      <ContentRoute
        path="/rtm-management/salesforceManagement/salesforceProfile/view/:id"
        component={SalesForceInfoViewForm}
      />
      <ContentRoute
        path="/rtm-management/salesforceManagement/salesforceProfile/edit/:id"
        component={SalesForceInfoEditForm}
      />
      {/* <ContentRoute
        path="/rtm-management/salesforceManagement/salesforceProfile/personal/edit/:id"
        component={SalesPersonalInfoCollapsePanel}
      /> */}
      <ContentRoute
        path="/rtm-management/salesforceManagement/salesforceProfile/official/edit/:id"
        component={SalesOfficialInfoCollapsePanel}
      />
      <ContentRoute
        path="/rtm-management/salesforceManagement/salesforceProfile/create"
        component={SalesForceElmployeeInformationForm}
      />
      <ContentRoute
        path="/rtm-management/salesforceManagement/salesforceProfile"
        component={SalesBasicInformationlLanding}
      />

      {/* salesforce Route Setup */}
      <ContentRoute
        path="/rtm-management/salesforceManagement/salesforceRouteSetup/approve/:employeeId/:tourId"
        component={RouteSetupApproveForm}
      />
      <ContentRoute
        path="/rtm-management/salesforceManagement/salesforceRouteSetup/view/:employeeId/:tourId"
        component={RouteSetupViewForm}
      />
      <ContentRoute
        path="/rtm-management/salesforceManagement/salesforceRouteSetup/edit/:employeeId/:tourId"
        component={RouteSetupForm}
      />
      <ContentRoute
        path="/rtm-management/salesforceManagement/salesforceRouteSetup/add"
        component={RouteSetupForm}
      />
      <ContentRoute
        path="/rtm-management/salesforceManagement/salesforceRouteSetup"
        component={RouteSetupLanding}
      />

      {/* salesforce Transfer */}
      <ContentRoute
        path="/rtm-management/salesforceManagement/salesforceTransfer/transfer/:id"
        component={SalesforceTranferForm}
      />
      <ContentRoute
        path="/rtm-management/salesforceManagement/salesforceTransfer"
        component={SalesforceTransferLanding}
      />

      {/* SalesForce Fixed Ta Da */}
      <ContentRoute
        path="/rtm-management/salesforceManagement/salesforceFixedTaDa/view/:id"
        component={ViewSalesForceFixedTaDA}
      />

      <ContentRoute
        path="/rtm-management/salesforceManagement/salesforceFixedTaDa/edit/:id"
        component={SalesForceFixedTaDAForm}
      />

      <ContentRoute
        path="/rtm-management/salesforceManagement/salesforceFixedTaDa/create"
        component={SalesForceFixedTaDAForm}
      />

      <ContentRoute
        path="/rtm-management/salesforceManagement/salesforceFixedTaDa"
        component={SalesForceFixedTaDALanding}
      />

      {/* salesforce Target Setup */}
      <ContentRoute
        path="/rtm-management/salesforceManagement/salesTargetSetup/edit/:id"
        component={SalesTargetSetupForm}
      />
      <ContentRoute
        path="/rtm-management/salesforceManagement/salesTargetSetup"
        component={SalesTargetSetupForm}
      />

      {/* Asset Allocation */}
      <ContentRoute
        path="/rtm-management/salesforceManagement/assetAllocation"
        component={AssetAllocationLanding}
      />
      <ContentRoute
        path="/rtm-management/salesforceManagement/salesforceMonthlyTaDa"
        component={SalesforceMonthlyTaDa}
      />
      {/* Bulk sale target setup */}
      <ContentRoute
        path="/rtm-management/salesforceManagement/bulkSalesTargetSetup"
        component={BulkSalesTargetSetup}
      />
    </Switch>
  );
}
export default SalesforcePages;
