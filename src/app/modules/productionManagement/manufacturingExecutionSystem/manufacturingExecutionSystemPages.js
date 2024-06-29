import React from "react";
import { Redirect, Switch, useLocation } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
// import { BillOfMaterial } from "./billOfMaterial";
// import BillOfMaterialForm from "./billOfMaterial/Form/addEditForm";
import ProductionEntry from "./productionEntry";
// import ProductionEntryForm from "./productionEntry/Form/AddEditForm";
import { BillOfMaterialLanding } from "./billOfMaterial";
import BillofMaretialCreateForm from "./billOfMaterial/Create/addForm";
import ProductionOrderCreateForm from "./productionOrder/create/addForm";
// import BillOfMaterialForm from "./billOfMaterial/FormOld/addEditForm";
import { shallowEqual, useSelector } from "react-redux";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import findIndex from "./../../_helper/_findIndex";
import BillofMaretialViewForm from "./billOfMaterial/View/addForm";
import ProductionEntryApprovalForm from "./productionEntry/Approval/AddEditForm";
import ProductionEntryBackCalculationApprovalForm from "./productionEntry/ApprovalForBackCalculation/AddEditForm";
import BackCalculationEditForm from "./productionEntry/BackCalculationEditForm/AddEditForm";
import BackCalculationForm from "./productionEntry/BackCalculationForm/AddEditForm";
import WithOutBackCalculationForm from "./productionEntry/WithoutBackCalculationForm/AddEditForm";
import { ProductionOrderLanding } from "./productionOrder/Table/tableHeader";
import ProductionOrderClosed from "./productionOrder/closed/productionOrderClosed";
import CreateSubPOForm from "./productionOrder/createSubPO/addForm";
import ProductionOrderViewForm from "./productionOrder/view/addForm";
import ReceiveFromShopFloorCreateForm from "./receiveFromShopFloor/Create/addEditForm";
import { ReceiveFromShopFloorTable } from "./receiveFromShopFloor/Table/tableHeader";
import ReceiveFromShopFloorViewForm from "./receiveFromShopFloor/view/addEditForm";
import ShopFloorInvTransCreateForm from "./shopFloorInvTrans/Create/addEditForm";
import { ShopFloorInvTransactionTable } from "./shopFloorInvTrans/Table/tableHeader";
import ProductionEntryApprove from "./productionEntry/productionentryApprove";
import MachineEmpAssign from "./machineEmpAssign";
import CreateEditMachineEmpAssign from "./machineEmpAssign/CreateEditMachineEmpAssign";

export function ManufacturingExecutionSystemPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const location = useLocation();
  // console.log('location: ', location);

  const productionOrder = userRole[findIndex(userRole, "Production Order")];
  const productionEntry = userRole[findIndex(userRole, "Production Entry")];
  const billOfMaterial = userRole[findIndex(userRole, "Bill Of Material")];

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/production-management/mes"
        to="/production-management/mes/bill-of-material"
      />
      {/* production order */}
      <ContentRoute
        from="/production-management/mes/productionorder/closed"
        component={ProductionOrderClosed}
      />
      <ContentRoute
        from="/production-management/mes/productionorder/createSubPO/:id"
        component={CreateSubPOForm}
      />
      <ContentRoute
        from="/production-management/mes/productionorder/view/:id"
        component={
          productionOrder?.isView ? ProductionOrderViewForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/production-management/mes/productionorder/edit/:id"
        component={
          productionOrder?.isEdit ? ProductionOrderCreateForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/production-management/mes/productionorder/create"
        component={
          productionOrder?.isCreate
            ? ProductionOrderCreateForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/production-management/mes/productionorder"
        component={ProductionOrderLanding}
      />
      {/* bill of material route  */}
      <ContentRoute
        path="/production-management/mes/bill-of-material/add"
        component={BillofMaretialCreateForm}
      />

      <ContentRoute
        path="/production-management/mes/bill-of-material/edit/:id"
        component={
          billOfMaterial?.isEdit ? BillofMaretialCreateForm : NotPermittedPage
        }
      />

      <ContentRoute
        path="/production-management/mes/bill-of-material/view/:id"
        component={
          billOfMaterial?.isView ? BillofMaretialViewForm : NotPermittedPage
        }
      />

      <ContentRoute
        from="/production-management/mes/bill-of-material/create"
        component={
          billOfMaterial?.isCreate ? BillofMaretialCreateForm : NotPermittedPage
        }
      />

      <ContentRoute
        from="/production-management/mes/bill-of-material"
        component={BillOfMaterialLanding}
      />

      {/* PRODUCTION ENTRY */}

      <ContentRoute
        from="/production-management/mes/production-entry-approve"
        component={ProductionEntryApprove}
      />
      <ContentRoute
        from="/production-management/mes/productionentry/approval/:aId/:backCalculationId"
        component={ProductionEntryApprovalForm}
      />
      <ContentRoute
        from="/production-management/mes/productionentry/approveBackCalculation/:bId"
        component={ProductionEntryBackCalculationApprovalForm}
      />

      <ContentRoute
        from="/production-management/mes/productionentry/create"
        component={
          location?.state?.data?.isBackCalculation === 1
            ? productionEntry?.isCreate
              ? BackCalculationForm
              : NotPermittedPage
            : productionEntry?.isCreate
            ? WithOutBackCalculationForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/production-management/mes/productionentry/edit/:id"
        component={
          productionEntry?.isEdit
            ? WithOutBackCalculationForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/production-management/mes/productionentry/backCalculationEdit/:id"
        component={
          productionEntry?.isEdit ? BackCalculationEditForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/production-management/mes/productionentry"
        component={ProductionEntry}
      />
      <ContentRoute
        from="/production-management/mes/machine-employee-assign/edit/:id"
        component={CreateEditMachineEmpAssign}
      />
      <ContentRoute
        from="/production-management/mes/machine-employee-assign/create"
        component={CreateEditMachineEmpAssign}
      />
      <ContentRoute
        from="/production-management/mes/machine-employee-assign"
        component={MachineEmpAssign}
      />

      {/* Shop Floor Inventory Transaction*/}
      <ContentRoute
        from="/production-management/mes/shopFloorInventoryTransaction/view/:viewId"
        component={ShopFloorInvTransCreateForm}
      />
      <ContentRoute
        from="/production-management/mes/shopFloorInventoryTransaction/edit/:id"
        component={ShopFloorInvTransCreateForm}
      />
      <ContentRoute
        from="/production-management/mes/shopFloorInventoryTransaction/create"
        component={ShopFloorInvTransCreateForm}
      />
      <ContentRoute
        from="/production-management/mes/shopFloorInventoryTransaction"
        component={ShopFloorInvTransactionTable}
      />
      {/* Receive From Shop Floor*/}
      <ContentRoute
        from="/production-management/mes/receivefromshopfloor/view/:id"
        component={ReceiveFromShopFloorViewForm}
      />
      <ContentRoute
        from="/production-management/mes/receivefromshopfloor/create"
        component={ReceiveFromShopFloorCreateForm}
      />
      <ContentRoute
        from="/production-management/mes/receivefromshopfloor"
        component={ReceiveFromShopFloorTable}
      />
    </Switch>
  );
}
