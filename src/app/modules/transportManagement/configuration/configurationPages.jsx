import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import findIndex from "../../_helper/_findIndex";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import AllowanceSetUpLanding from "./allowanceSetUp";
import { checkPostNewTable } from "./checkPostNew/Table/tableHeader";
import CheckPostNewCreateForm from "./checkPostNew/create/addForm";
import CheckPostNewViewForm from "./checkPostNew/view/addForm";
import CostComponentLanding from "./costComponent";
import CostComponentCreateForm from "./costComponent/create/addForm";
import { PartnerWiseRentSetupLanding } from "./partnerWiseRentSetup";
import PartnerWiseRentSetupForm from "./partnerWiseRentSetup/Form/addEditForm";
import PartnerWiseRentSetupExtendForm from "./partnerWiseRentSetup/extend/addEditForm";
import { RouteStandardLanding } from "./routeStandard";
import RouteStandardForm from "./routeStandard/Form/addEditForm";
import ShipmentCostRatePermitForm from "./shipmentCostRatePermit/create/addForm";
import { ShipmentCostRatePermitLanding } from "./shipmentCostRatePermit/landing/grid";
import ShippmentTerritoryForm from "./shippmentTerritory/create/addForm";
import { ShippmentTerritory } from "./shippmentTerritory/landing";
import TranportOrganizationLanding from "./transportOrganization";
import TransportOrganizationCreateForm from "./transportOrganization/Form/addEditForm";
import TransportOrgExtendForm from "./transportOrganization/extend/addEditForm";
import { TransportRoute } from "./transportRoute";
import TransportRouteForm from "./transportRoute/Form/addEditForm";
import { TransportZone } from "./transportZone";
import TransportZoneForm from "./transportZone/Form/addEditForm";
import { Vehicle } from "./vehicle";
import VehicleForm from "./vehicle/Form/addEditForm";
import VehicleUserTagging from "./vehicleUserTagging";
import ZoneCostRateForm from "./zoneCostRate/create/addForm";
import { ZoneCostRateLanding } from "./zoneCostRate/landing";
// import ShippingPointTransportZoneLanding from "./shippingPointTransportZone";
// import ShippingPointTransportZoneLandingCreateEdit from "./shippingPointTransportZone/createEdit";
import FuelRateConfigCreateAndEdit from "./fuleRateConfig/create";
import FuelRateConfig from "./fuleRateConfig/landing";
import ShippingPointTransportZoneForm from "./shippingPointTransportZone/form/addEditForm";
import ShippingPointTransportZoneLanding from "./shippingPointTransportZone/landing/form";
import VehicleAllowanceSetup from "./vehicleAllowanceSetup/Landing";
import PumpInformation from "./pumpinformation";
import CreateEditPumpInformation from "./pumpinformation/createEdit";

export function ConfigurationPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const transportOrganizationPermission =
    userRole[findIndex(userRole, "Transport Organization")];
  const vehiclePermission = userRole[findIndex(userRole, "Vehicle")];
  const routeCostComponentPermission =
    userRole[findIndex(userRole, "Route Cost Component")];
  const routeCostSetupPermission =
    userRole[findIndex(userRole, "Route Cost Setup")];
  const checkPostPermission = userRole[findIndex(userRole, "Check Post")];
  const transportRoutePermission =
    userRole[findIndex(userRole, "Transport Route")];
  const transportZonePermission =
    userRole[findIndex(userRole, "Transport Zone")];

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/transport-management"
        to="/transport-management/configuration"
      />

      {/* transport zone */}
      <ContentRoute
        from="/transport-management/configuration/transportzone/edit/:id"
        component={
          transportZonePermission?.isEdit ? TransportZoneForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/transport-management/configuration/transportzone/add"
        component={
          transportZonePermission?.isEdit ? TransportZoneForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/transport-management/configuration/transportzone"
        component={TransportZone}
      />

      {/* All Transport Route */}
      <ContentRoute
        from="/transport-management/configuration/transportroute/add"
        component={
          transportRoutePermission?.isCreate
            ? TransportRouteForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/transport-management/configuration/transportroute/extend/:id"
        component={
          transportRoutePermission?.isCreate
            ? TransportRouteForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/transport-management/configuration/transportroute"
        component={TransportRoute}
      />

      <ContentRoute
        from="/transport-management/configuration/pumpinformation/edit"
        component={CreateEditPumpInformation}
      />

      <ContentRoute
        from="/transport-management/configuration/pumpinformation/create"
        component={CreateEditPumpInformation}
      />

      <ContentRoute
        from="/transport-management/configuration/pumpinformation"
        component={PumpInformation}
      />

      {/* Route Standard Cost */}
      <ContentRoute
        path="/transport-management/configuration/routestandardcost/:type/:id"
        component={
          routeCostSetupPermission?.isView
            ? RouteStandardForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/transport-management/configuration/routestandardcost/add"
        component={
          routeCostSetupPermission?.isCreate
            ? RouteStandardForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/transport-management/configuration/routestandardcost"
        component={RouteStandardLanding}
      />

      {/* CostComponent */}
      {/* <ContentRoute
        path="/transport-management/configuration/costcomponent/view/:id"
        component={CostComponentViewForm}
      /> */}
      <ContentRoute
        path="/transport-management/configuration/costcomponent/edit/:id"
        component={
          routeCostComponentPermission?.isEdit
            ? CostComponentCreateForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/transport-management/configuration/costcomponent/add"
        component={
          routeCostComponentPermission?.isCreate
            ? CostComponentCreateForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/transport-management/configuration/costcomponent"
        component={CostComponentLanding}
      />

      {/* Transport organization Route */}
      <ContentRoute
        path="/transport-management/configuration/transportorganization/extend/:extend"
        component={
          transportOrganizationPermission?.isCreate
            ? TransportOrgExtendForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/transport-management/configuration/transportorganization/edit/:id"
        component={
          transportOrganizationPermission?.isEdit
            ? TransportOrganizationCreateForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/transport-management/configuration/transportorganization/add"
        component={
          transportOrganizationPermission?.isCreate
            ? TransportOrganizationCreateForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/transport-management/configuration/transportorganization"
        component={TranportOrganizationLanding}
      />

      {/* Vehicle */}
      <ContentRoute
        path="/transport-management/configuration/vehicle/add"
        component={vehiclePermission?.isCreate ? VehicleForm : NotPermittedPage}
      />
      <ContentRoute
        path="/transport-management/configuration/vehicle/edit/:id"
        component={vehiclePermission?.isEdit ? VehicleForm : NotPermittedPage}
      />
      <ContentRoute
        path="/transport-management/configuration/vehicle"
        component={Vehicle}
      />
      {/* check post new  */}
      <ContentRoute
        path="/transport-management/configuration/checkpostCreate/edit/:id"
        component={
          checkPostPermission?.isEdit
            ? CheckPostNewCreateForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/transport-management/configuration/checkpostCreate/view/:id"
        component={
          checkPostPermission?.isView ? CheckPostNewViewForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/transport-management/configuration/checkpostCreate/add"
        component={
          checkPostPermission?.isCreate
            ? CheckPostNewCreateForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/transport-management/configuration/checkpostCreate"
        component={checkPostNewTable}
      />

      <ContentRoute
        path="/transport-management/configuration/shippingpointtransportzone/edit/:id"
        component={ShippingPointTransportZoneForm}
      />
      <ContentRoute
        path="/transport-management/configuration/shippingpointtransportzone/create"
        component={ShippingPointTransportZoneForm}
      />
      <ContentRoute
        path="/transport-management/configuration/shippingpointtransportzone"
        component={ShippingPointTransportZoneLanding}
      />

      {/* Allowance Setup */}

      <ContentRoute
        path="/transport-management/configuration/allowancesetup"
        component={AllowanceSetUpLanding}
      />

      {/* Vehicle allowance setup */}
      <ContentRoute
        path="/transport-management/configuration/vehicleallowancesetup"
        component={VehicleAllowanceSetup}
      />

      {/* Partner wise rent setup */}
      <ContentRoute
        path="/transport-management/configuration/partner-wise-rent-setup/extend/:id"
        component={PartnerWiseRentSetupExtendForm}
      />
      <ContentRoute
        path="/transport-management/configuration/partner-wise-rent-setup/add"
        component={PartnerWiseRentSetupForm}
      />
      <ContentRoute
        path="/transport-management/configuration/partner-wise-rent-setup"
        component={PartnerWiseRentSetupLanding}
      />

      {/* Zone Cost Rate  */}
      <ContentRoute
        path="/transport-management/configuration/zoneCostRate/view/:viewId"
        component={ZoneCostRateForm}
      />
      <ContentRoute
        path="/transport-management/configuration/zoneCostRate/edit/:id"
        component={ZoneCostRateForm}
      />
      <ContentRoute
        path="/transport-management/configuration/zoneCostRate/create"
        component={ZoneCostRateForm}
      />
      <ContentRoute
        path="/transport-management/configuration/zoneCostRate"
        component={ZoneCostRateLanding}
      />
      <ContentRoute
        path="/transport-management/configuration/shipmentTerritoryConfig/create"
        component={ShippmentTerritoryForm}
      />
      <ContentRoute
        path="/transport-management/configuration/shipmentTerritoryConfig"
        component={ShippmentTerritory}
      />
      <ContentRoute
        path="/transport-management/configuration/shipmentCostRatePermit/edit/:id"
        component={ShipmentCostRatePermitForm}
      />
      <ContentRoute
        path="/transport-management/configuration/shipmentCostRatePermit/create"
        component={ShipmentCostRatePermitForm}
      />
      <ContentRoute
        path="/transport-management/configuration/shipmentCostRatePermit"
        component={ShipmentCostRatePermitLanding}
      />
      {/* Vehicle User Tagging */}
      <ContentRoute
        path="/transport-management/configuration/vehicleusertagging"
        component={VehicleUserTagging}
      />
      <ContentRoute
        path="/transport-management/configuration/fuelrateconfig/edit/:id"
        component={FuelRateConfigCreateAndEdit}
      />
      <ContentRoute
        path="/transport-management/configuration/fuelrateconfig/create"
        component={FuelRateConfigCreateAndEdit}
      />
      <ContentRoute
        path="/transport-management/configuration/fuelrateconfig"
        component={FuelRateConfig}
      />
    </Switch>
  );
}
