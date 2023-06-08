import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { Suspense } from "react";
import TransferInLanding from "./transferIn";
import {
  LayoutSplashScreen, 
  ContentRoute,
} from "../../../../../_metronic/layout";
import TranserInCreateForm from "./transferIn/Form/addEditForm";
import TransferOutLanding from "./transferOut";
import TrasferOutCreateForm from "./transferOut/Create/addForm";
import ItemDestroyLanding from "./itemDestroy/Table/form";
import ItemDestroyForm from './itemDestroy/Form/addEditForm';

export function InventoryTransactionPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/operation"
          to="/operation/inventoryTransaction"
        />

        {/* transferIn Page */}
        <ContentRoute
          path="/operation/inventoryTransaction/transferIn/create"
          component={TranserInCreateForm}
        />
        <ContentRoute
          path="/operation/inventoryTransaction/transferIn"
          component={TransferInLanding}
        />
        {/* transferOut */}
        <ContentRoute
          path="/operation/inventoryTransaction/transferOut/edit/:id"
          component={TrasferOutCreateForm}
        />
        <ContentRoute
          path="/operation/inventoryTransaction/transferOut/add"
          component={TrasferOutCreateForm}
        />
        <ContentRoute
          path="/operation/inventoryTransaction/transferOut"
          component={TransferOutLanding}
        />
        {/* itemDestroy */}
        <ContentRoute
          path="/operation/inventoryTransaction/itemDestroy/add"
          component={ItemDestroyForm}
        />
        <ContentRoute
          path="/operation/inventoryTransaction/itemDestroy"
          component={ItemDestroyLanding}
        />
      </Switch>
    </Suspense>
  );
}

export default InventoryTransactionPages;
