import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import { PlantWarehouseConfig } from "./configPlantWarehouse";
import AddFormPlant from "./plant/WarehouseCreate/addForm";
import PlantEditForm from "./plant/businessUnitEdit/editForm";
import EditFormExtend from "./plant/businessUnitEdit/editFormExtend";
import { Warehouse } from "./warehouse";
import AddForm from "./warehouse/WarehouseCreate/addForm";
import EditForm from "./warehouse/businessUnitEdit/editForm";

import { shallowEqual, useSelector } from "react-redux";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import findIndex from "./../../_helper/_findIndex";
import PlantWarehouseAddForm from "./configPlantWarehouse/plantWarehouseCreate/addForm";
import { InventoryLocation } from "./inventoryLocation";
import InventoryLocationEditForm from "./inventoryLocation/businessUnitEdit/editForm";
import InventoryLocationAddForm from "./inventoryLocation/plantWarehouseCreate/addForm";
import LoadingPoint from "./loadingPoint";
import { LoadingPointAddForm } from "./loadingPoint/Form/addEditForm";
import PlantLanding from "./plant/Table/index";
// import { ShipPointOperatorForm } from "./shipPointOperator/Form/AddEditForm";
import ShipPointCreateForm from "./shipPointOperator/create/create";
import ShippingPoint from "./shippingPoint";
import ShippingPointForm from "./shippingPoint/Form/addEditForm";
import { TransportZoneUpdateForm } from "./transportZoneUpdate/Form/AddEditForm";
// import ShipPointOperatorLanding from "./shipPointOperator/landing/table";
import ShipPointOperatorLanding from "./shipPointOperator/landing/landing";

export function ConfigurationPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const plant = userRole[findIndex(userRole, "Plant")];
  const wh = userRole[findIndex(userRole, "Warehouse")];
  const configPlantWh = userRole[findIndex(userRole, "Config Plant Warehouse")];
  const inventoryLocation = userRole[findIndex(userRole, "Inventory Location")];
  const loadingPoint = userRole[findIndex(userRole, "Loading Point")];
  const shippingPoint = userRole[findIndex(userRole, "Shipping Point")];

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/inventory-management/configuration"
        to="/inventory-management/configuration/plant"
      />

      <ContentRoute
        from="/inventory-management/configuration/loadingpoint/add"
        component={
          loadingPoint?.isCreate ? LoadingPointAddForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/inventory-management/configuration/plant/extend/:id"
        component={plant?.isCreate ? EditFormExtend : NotPermittedPage}
      />
      <ContentRoute
        from="/inventory-management/configuration/loadingpoint/edit/:id"
        component={
          loadingPoint?.isEdit ? LoadingPointAddForm : NotPermittedPage
        }
      />

      {/* Plant Route */}
      <ContentRoute
        path="/inventory-management/configuration/plant/add"
        component={plant?.isCreate ? AddFormPlant : NotPermittedPage}
      />
      <ContentRoute
        path="/inventory-management/configuration/plant/edit/:id"
        component={plant?.isEdit ? PlantEditForm : NotPermittedPage}
      />
      <ContentRoute
        path="/inventory-management/configuration/plant"
        component={PlantLanding}
      />

      {/* warehouse route */}
      <ContentRoute
        path="/inventory-management/configuration/warehouse/add"
        component={wh?.isCreate ? AddForm : NotPermittedPage}
      />
      <ContentRoute
        path="/inventory-management/configuration/warehouse/edit/:id"
        component={wh?.isEdit ? EditForm : NotPermittedPage}
      />
      <ContentRoute
        path="/inventory-management/configuration/warehouse"
        component={Warehouse}
      />

      <ContentRoute
        path="/inventory-management/configuration/conf-plant-warehouse/add"
        component={
          configPlantWh?.isCreate ? PlantWarehouseAddForm : NotPermittedPage
        }
      />

      <ContentRoute
        path="/inventory-management/configuration/inventory-location/add"
        component={
          inventoryLocation?.isCreate
            ? InventoryLocationAddForm
            : NotPermittedPage
        }
      />

      <ContentRoute
        path="/inventory-management/configuration/inventory-location/edit/:id"
        component={
          inventoryLocation?.isEdit
            ? InventoryLocationEditForm
            : NotPermittedPage
        }
      />

      <ContentRoute
        path="/inventory-management/configuration/inventory-location"
        component={InventoryLocation}
      />

      <ContentRoute
        path="/inventory-management/configuration/conf-plant-warehouse"
        component={PlantWarehouseConfig}
      />

      <ContentRoute
        path="/inventory-management/configuration/loadingpoint"
        component={LoadingPoint}
      />
      {/* ShippingPoint routes */}
      <ContentRoute
        path="/inventory-management/configuration/shippingpoint/extend/:extendId"
        component={
          shippingPoint?.isCreate ? ShippingPointForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/inventory-management/configuration/shippingpoint/add"
        component={
          shippingPoint?.isCreate ? ShippingPointForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/inventory-management/configuration/shippingpoint"
        component={ShippingPoint}
      />

      {/* Transport Zone Update */}
      <ContentRoute
        path="/inventory-management/configuration/transportZoneUpdate"
        component={TransportZoneUpdateForm}
      />

      <ContentRoute
        path="/inventory-management/configuration/shippingpointoperator/add"
        component={ShipPointCreateForm}
      />

      <ContentRoute
        path="/inventory-management/configuration/shippingpointoperator"
        component={ShipPointOperatorLanding}
      />
    </Switch>
  );
}
