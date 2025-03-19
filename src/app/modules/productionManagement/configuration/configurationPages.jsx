import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import findIndex from "./../../_helper/_findIndex";
import CapacityConfigurationCreateEdit from "./OEECapacityConfiguration/capacityConfigurationCreateEdit/capacityConfigurationCreateEdit";
import OEECapacityConfigurationLanding from "./OEECapacityConfiguration/landing";
import OEEMachineAndChecklistLanding from "./OEEMachineAndChecklist";
import OEEMachineAndChecklistLandingCreateEdit from "./OEEMachineAndChecklist/createEdit";
import CheckListView from "./OEEMachineAndChecklist/view";
import HorizonForm from "./horizon/form/addEditForm";
import HorizonLanding from "./horizon/landing/table";
import ProductionLine from "./productionLine";
import ProductionLineForm from "./productionLine/Form/AddEditForm";
import { RoutingForm } from "./routing/form/addEditForm";
import RoutingLanding from "./routing/landing/landing";
import { RoutingView } from "./routing/view/addEditView";
import { ShopFloor } from "./shopFloor";
import ShopFloorForm from "./shopFloor/form/addEditForm";
import { WorkCenter } from "./workcenter";
import WorkCenterForm from "./workcenter/form/addForm";
import WorkCenterViewForm from "./workcenter/viewForm/addForm";

export function ConfigurationPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const shopFloor = userRole[findIndex(userRole, "Shop Floor")];
  const productionLine = userRole[findIndex(userRole, "Production Line")];
  const workCenter = userRole[findIndex(userRole, "Work Center")];
  const routing = userRole[findIndex(userRole, "Routing")];

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/production-management"
        to="/production-management/configuration"
      />
      {/* Shop Floor */}
      <ContentRoute
        path="/production-management/configuration/shopfloor/create"
        component={shopFloor?.isCreate ? ShopFloorForm : NotPermittedPage}
      />
      <ContentRoute
        path="/production-management/configuration/shopfloor/edit/:id"
        component={shopFloor?.isEdit ? ShopFloorForm : NotPermittedPage}
      />
      <ContentRoute
        path="/production-management/configuration/shopfloor"
        component={ShopFloor}
      />

      {/* PRODUCTION LINE ROUTE */}
      <ContentRoute
        path="/production-management/configuration/productionline/create"
        component={
          productionLine?.isCreate ? ProductionLineForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/configuration/productionline/edit/:id"
        component={
          productionLine?.isEdit ? ProductionLineForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/configuration/productionline"
        component={ProductionLine}
      />

      {/* Routing */}

      <ContentRoute
        path="/production-management/configuration/routing/create"
        component={routing?.isCreate ? RoutingForm : NotPermittedPage}
      />
      <ContentRoute
        path="/production-management/configuration/routing/view/:id"
        component={routing?.isView ? RoutingView : NotPermittedPage}
      />
      <ContentRoute
        path="/production-management/configuration/routing/edit/:id"
        component={routing?.isEdit ? RoutingForm : NotPermittedPage}
      />

      <ContentRoute
        path="/production-management/configuration/routing"
        component={RoutingLanding}
      />

      {/* Work Center*/}
      <ContentRoute
        path="/production-management/configuration/workcenter/create"
        component={workCenter?.isCreate ? WorkCenterForm : NotPermittedPage}
      />
      <ContentRoute
        path="/production-management/configuration/workcenter/edit/:id"
        component={workCenter?.isEdit ? WorkCenterForm : NotPermittedPage}
      />
      <ContentRoute
        path="/production-management/configuration/workcenter/view/:id"
        component={workCenter?.isView ? WorkCenterViewForm : NotPermittedPage}
      />
      <ContentRoute
        path="/production-management/configuration/workcenter"
        component={WorkCenter}
      />

      {/* Horizon */}
      <ContentRoute
        path="/production-management/configuration/horizon/create"
        component={HorizonForm}
      />
      <ContentRoute
        path="/production-management/configuration/horizon"
        component={HorizonLanding}
      />
      <ContentRoute
        path="/production-management/configuration/OEEMachineNChecklist/view/:id"
        component={CheckListView}
      />
      <ContentRoute
        path="/production-management/configuration/OEEMachineNChecklist/create"
        component={OEEMachineAndChecklistLandingCreateEdit}
      />
      <ContentRoute
        path="/production-management/configuration/OEEMachineNChecklist"
        component={OEEMachineAndChecklistLanding}
      />

      {/* OEECapacityConfiguration route */}
      <ContentRoute
        path="/production-management/configuration/OEECapacityConfiguration/create"
        component={CapacityConfigurationCreateEdit}
      />
      <ContentRoute
        path="/production-management/configuration/OEECapacityConfiguration/edit"
        component={CapacityConfigurationCreateEdit}
      />
      <ContentRoute
        path="/production-management/configuration/OEECapacityConfiguration"
        component={OEECapacityConfigurationLanding}
      />
    </Switch>
  );
}
