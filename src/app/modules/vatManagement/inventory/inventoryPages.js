import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import HeaderForm from "./itemDestroy/Table/form";
import TransferInLanding from "./transferIn";
import TranserInCreateForm from "./transferIn/Form/addEditForm";
import ProductionLanding from "./production";
import ProductionForm from "./production/Form/addEditForm";
import TransferOutLanding from "./transferOut";
import TrasferOutCreateForm from "./transferOut/Create/addForm";
import TrasferOutViewForm from "./transferOut/View/addForm";
import ItemDestroyForm from "./itemDestroy/Form/addEditForm";
import ItemDestroyViewForm from "./itemDestroy/View/addEditForm";
import ItemTransferInViewForm from "./transferIn/view/addForm";
import { TransferOutIbosTable } from "./transfer-out-ibos/Table/tableHeader";
import TransferOutIbosCreateForm from "./transfer-out-ibos/create/addForm";
import ContractManuFacturerlForm from "./contractManufacturer/Form/addEditForm";
import ContractManuFacturerlLanding from "./contractManufacturer/Table";
import findIndex from "./../../_helper/_findIndex";
import NotPermittedPage from "./../../_helper/notPermitted/NotPermittedPage";

export default function InventoryPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const producttion = userRole[findIndex(userRole, "Production")];
  const transferOut = userRole[findIndex(userRole, "Transfer Out")];
  const transferOutIbos = userRole[findIndex(userRole, "Transfer Out (IBOS)")];
  const transferIn = userRole[findIndex(userRole, "Transfer In")];
  const itemDestroy = userRole[findIndex(userRole, "Item Destroy")];

  return (
    <Switch>
      <Redirect exact={true} from="/purchase" to="/mngVat/inventory" />
      {/* item-Destroy */}

      <ContentRoute
        path="/mngVat/inventory/itemDestroy/view/:id/:itemTypeId"
        component={itemDestroy?.isView ? ItemDestroyViewForm : NotPermittedPage}
      />
      <ContentRoute
        path="/mngVat/inventory/itemDestroy/add"
        component={itemDestroy?.isCreate ? ItemDestroyForm : NotPermittedPage}
      />
      <ContentRoute
        path="/mngVat/inventory/itemDestroy"
        component={HeaderForm}
      />
      {/* Transfer In route */}

      <ContentRoute
        path="/mngVat/inventory/transferin/view/:id"
        component={
          transferIn?.isView ? ItemTransferInViewForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/mngVat/inventory/transferin/create"
        component={
          transferIn?.isCreate ? TranserInCreateForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/mngVat/inventory/transferin"
        component={TransferInLanding}
      ></ContentRoute>
      <Redirect exact={true} from="/inventory" to="/mngVat/inventory" />

      {/*Prouction page route */}
      <ContentRoute
        path="/mngVat/inventory/production/edit/:id"
        component={producttion?.isEdit ? ProductionForm : NotPermittedPage}
      />
      <ContentRoute
        path="/mngVat/inventory/production/add"
        component={producttion?.isCreate ? ProductionForm : NotPermittedPage}
      />

      <ContentRoute
        path="/mngVat/inventory/production"
        component={ProductionLanding}
      />
      {/* TransferOut Routes */}
      <ContentRoute
        path="/mngVat/inventory/transferout/view/:id"
        component={transferOut?.isView ? TrasferOutViewForm : NotPermittedPage}
      />

      <ContentRoute
        path="/mngVat/inventory/transferout/edit/:id"
        component={
          transferOut?.isEdit ? TrasferOutCreateForm : NotPermittedPage
        }
      />

      <ContentRoute
        path="/mngVat/inventory/transferout/add"
        component={
          transferOut?.isCreate ? TrasferOutCreateForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/mngVat/inventory/transferout"
        component={TransferOutLanding}
      />
      {/* transfer-out-ibos */}
      <ContentRoute
        path="/mngVat/inventory/transferoutIbos/create"
        component={
          transferOutIbos?.isCreate
            ? TransferOutIbosCreateForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/mngVat/inventory/transferoutIbos"
        component={TransferOutIbosTable}
      />

      {/* Contract Manufacturer Report */}
      <ContentRoute
        path="/mngVat/inventory/conmanufacturer/edit/:id"
        component={ContractManuFacturerlForm}
      />
      <ContentRoute
        path="/mngVat/inventory/conmanufacturer/add"
        component={ContractManuFacturerlForm}
      />
      <ContentRoute
        path="/mngVat/inventory/conmanufacturer"
        component={ContractManuFacturerlLanding}
      />
    </Switch>
  );
}
