import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import findIndex from "./../../_helper/_findIndex";
import AssetsReceiveForm from "./assetReceive/Form/addEditForm";
import AssetReceiveLanding from "./assetReceive/Landing";
import { AssetReceiveReportView } from "./assetReceive/report/tableHeader";
import AssetReceiveViewForm from "./assetReceive/view/addEditForm";
import { CancelInventory } from "./cancelInventory";
import CancelInventoryForm from "./cancelInventory/Form/addEditForm";
import { CancelInvReportView } from "./cancelInventory/report/tableHeader";
import { Delivery } from "./delivery";
import DeliveryForm from "./delivery/Form/addEditForm";
import { GrnforPO } from "./grnforPo";
import ReceiveInvCreateForm from "./grnforPo/Form/createForm";
import InvTransaction from "./invTransaction";
import { ForminvTrans } from "./invTransaction/Form";
import ViewInvTransactionForm from "./invTransaction/View/addEditForm";
import { CreateIssueForProduction } from "./issueForProduction/Create/addEditForm";
import { IssueProduction } from "./issueForProduction/Landing/addEditForm";
import { ItemRequest } from "./itemRequest";
import ItemRequestForm from "./itemRequest/Form/addEditForm";
import ViewItemRequestForm from "./itemRequest/view/addEditForm";
import ServiceReceiveForm from "./serviceReceive/Form/addEditForm";
import ServiceReceiveLanding from "./serviceReceive/Landing";
import { ServiceReceiveReportView } from "./serviceReceive/report/tableHeader";
import ServiceReceiveViewForm from "./serviceReceive/view/addEditForm";
// import InventoryLoadLanding from "./inventoryLoan/landing";
import InvAdjustment from "./InventoryAdjustment";
import InventoryAdjustmentCreate from "./InventoryAdjustment/form";
import BrandItemRequisitionForm from "./brandItemRequisition/form/addEditForm";
import BrandItemRequisitionLanding from "./brandItemRequisition/landing";
import CastingScheduleForm from "./castingSchedule/form/addEditForm";
import CastingScheduleLanding from "./castingSchedule/landing";
import CastingScheduleApproveLanding from "./castingScheduleApprove/landing/addEditForm";
import HologramBaseDeliveryForm from "./hologramBaseDelivery/form/addEditForm";
import HologramBaseDeliveryLanding from "./hologramBaseDelivery/landing/form";
import InvTransactionImport from "./invTransactionImport";
import { ForminvTransImport } from "./invTransactionImport/Form";
import ViewInvTransactionFormImport from "./invTransactionImport/View/addEditForm";
import InventoryAdjustApprove from "./inventoryAdjustApprove";
import InventoryLoanApproveLanding from "./inventoryLoanApprove";
import InventoryLoanLandingNew from "./inventoryLoanNew";
import InventoryLoanCreateEditNew from "./inventoryLoanNew/createEdit";
import ItemQualityCheckLanding from "./itemQualityCheck";
import QualityCheckCreateForm from "./itemQualityCheck/createAndEditForm";
import CreateMRR from "./itemQualityCheck/createMRR";
import ItemWiseSerialUpdate from "./itemWiseSerialUpdate";
import ItemWiseSerialCreate from "./itemWiseSerialUpdate/create";
import ItemWiseSerialEdit from "./itemWiseSerialUpdate/editItemWiseSerial";
import LiftingEntryForm from "./liftingEntry/form/addEditForm";
import LiftingEntry from "./liftingEntry/landing";
import LiftingEntryApproveForm from "./liftingEntryApprove/landing/addEditForm";
import LiftingPlan from "./liftingPlan";
import MRRCancel from "./mrrCancel";
import TargetVSProductionRequestForm from "./targetVSProductionRequest/form/addEditForm";
import TargetVSProductionRequest from "./targetVSProductionRequest/landing";
import LogisticEquipment from "./logisticEquipment";
import LogisticEquipmentEntry from "./logisticEquipment/entry";
import ItemWiseSerialDetails from "../reports/itemwiseserialdetails/ItemWiseSerialDetails";

export function WarehouseManagementPages() {
  const { userRole, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const inventoryTransaction =
    userRole[findIndex(userRole, "Inventory Transaction")];
  const customerDelivery = userRole[findIndex(userRole, "Customer Delivery")];
  const assetReceive = userRole[findIndex(userRole, "Asset Receive")];
  const serviceReceive = userRole[findIndex(userRole, "Service Receive")];

  let inventoryLoan = null;
  let inventoryLoanApprv = null;
  let itemWiseSerialUpdate = null;
  let mrrCancelPermission = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1035) {
      inventoryLoan = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1405) {
      inventoryLoanApprv = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1194) {
      itemWiseSerialUpdate = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1227) {
      mrrCancelPermission = userRole[i];
    }
  }

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/inventory-management/warehouse-management"
        to="/inventory-management/warehouse-management/inventorytransaction"
      />

      {/* Invenory Transaction */}
      <ContentRoute
        from="/inventory-management/warehouse-management/inventorytransaction/view/:id"
        component={
          inventoryTransaction?.isView
            ? ViewInvTransactionForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/inventory-management/warehouse-management/inventorytransaction/create"
        component={
          inventoryTransaction?.isCreate ? ForminvTrans : NotPermittedPage
        }
      />
      <ContentRoute
        from="/inventory-management/warehouse-management/inventorytransaction"
        component={InvTransaction}
      />

      {/* Inv Transaction Import */}
      <ContentRoute
        from="/inventory-management/warehouse-management/inventorytransactionimport/view/:id"
        component={
          inventoryTransaction?.isView
            ? ViewInvTransactionFormImport
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/inventory-management/warehouse-management/inventorytransactionimport/create"
        component={
          inventoryTransaction?.isCreate ? ForminvTransImport : NotPermittedPage
        }
      />
      <ContentRoute
        from="/inventory-management/warehouse-management/inventorytransactionimport"
        component={InvTransactionImport}
      />

      {/* Issue for production */}
      <ContentRoute
        from="/inventory-management/warehouse-management/issueforproduction/create"
        component={CreateIssueForProduction}
      />
      <ContentRoute
        from="/inventory-management/warehouse-management/issueforproduction"
        component={IssueProduction}
      />

      {/* Grn for PO */}
      <ContentRoute
        from="/inventory-management/warehouse-management/grnForPO/view/:id"
        component={ViewInvTransactionForm}
      />
      <ContentRoute
        from="/inventory-management/warehouse-management/grnForPO/add"
        component={ReceiveInvCreateForm}
      />
      <ContentRoute
        from="/inventory-management/warehouse-management/grnForPO"
        component={GrnforPO}
      />

      {/* Grn for Po */}
      {/*  <ContentRoute
        from="/inventory-management/warehouse-management/grnForPO/add"
        component={GrnPOCreateForm}
      />
      <ContentRoute
        from="/inventory-management/warehouse-management/grnForPO"
        component={GrnforPO}
      /> */}

      {/* <ContentRoute
        from="/inventory-management/warehouse-management/inventorytransaction/view/:id"
        component={InventoryTransactionView}
      />

      <ContentRoute
        from="/inventory-management/warehouse-management/inventorytransaction/edit/:id"
        component={InventoryTransactionForm}
      />

      <ContentRoute
        from="/inventory-management/warehouse-management/inventorytransaction/add"
        component={InventoryTransactionForm}
      />

      <ContentRoute
        from="/inventory-management/warehouse-management/inventorytransaction"
        component={InventoryTransaction}
      /> */}

      {/* Item Request */}
      <ContentRoute
        from="/inventory-management/warehouse-management/item-request/view/:id"
        component={ViewItemRequestForm}
      />
      <ContentRoute
        from="/inventory-management/warehouse-management/item-request/edit/:id"
        component={ItemRequestForm}
      />
      <ContentRoute
        from="/inventory-management/warehouse-management/item-request/add"
        component={ItemRequestForm}
      />
      <ContentRoute
        from="/inventory-management/warehouse-management/item-request"
        component={ItemRequest}
      />

      {/* CanceInventory Form */}
      <ContentRoute
        from="/inventory-management/warehouse-management/cancelInventory/view/:CrId"
        component={CancelInvReportView}
      />

      <ContentRoute
        from="/inventory-management/warehouse-management/cancelInventory/add"
        component={
          // itemRequest?.isCreate ?
          CancelInventoryForm
          //  : NotPermittedPage
        }
      />
      <ContentRoute
        from="/inventory-management/warehouse-management/cancelInventory"
        component={CancelInventory}
      />

      {/* Delivery Routes */}
      <ContentRoute
        from="/inventory-management/warehouse-management/delivery/edit/:id"
        component={customerDelivery?.isEdit ? DeliveryForm : NotPermittedPage}
      />
      <ContentRoute
        from="/inventory-management/warehouse-management/delivery/add"
        component={customerDelivery?.isCreate ? DeliveryForm : NotPermittedPage}
      />
      <ContentRoute
        from="/inventory-management/warehouse-management/delivery"
        component={Delivery}
      />

      {/* Service Receive Routes */}
      <ContentRoute
        from="/inventory-management/warehouse-management/serviceReceive/viewReport/:Rcid"
        component={
          serviceReceive?.isView ? ServiceReceiveReportView : NotPermittedPage
        }
      />
      <ContentRoute
        from="/inventory-management/warehouse-management/serviceReceive/view/:id"
        component={
          serviceReceive?.isView ? ServiceReceiveViewForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/inventory-management/warehouse-management/serviceReceive/edit/:id"
        component={
          serviceReceive?.isEdit ? ServiceReceiveForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/inventory-management/warehouse-management/serviceReceive/create"
        component={
          serviceReceive?.isCreate ? ServiceReceiveForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/inventory-management/warehouse-management/serviceReceive"
        component={ServiceReceiveLanding}
      />

      {/* Asset Receive Routes */}
      <ContentRoute
        from="/inventory-management/warehouse-management/assetReceive/reportview/:Asid"
        component={
          assetReceive?.isView ? AssetReceiveReportView : NotPermittedPage
        }
      />
      <ContentRoute
        from="/inventory-management/warehouse-management/assetReceive/view/:id"
        component={
          assetReceive?.isView ? AssetReceiveViewForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/inventory-management/warehouse-management/assetReceive/edit/:id"
        component={assetReceive?.isEdit ? AssetsReceiveForm : NotPermittedPage}
      />
      <ContentRoute
        from="/inventory-management/warehouse-management/assetReceive/create"
        component={
          assetReceive?.isCreate ? AssetsReceiveForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/inventory-management/warehouse-management/assetReceive"
        component={AssetReceiveLanding}
      />
      {/* older inventory */}
      {/* <ContentRoute
        path="/inventory-management/warehouse-management/inventoryLoan"
        component={
          inventoryLoan?.isView ? InventoryLoadLanding : NotPermittedPage
        }
      /> */}
      {/* new inventory */}

      <ContentRoute
        path="/inventory-management/warehouse-management/inventoryLoan/create"
        component={
          inventoryLoan?.isCreate
            ? InventoryLoanCreateEditNew
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/inventory-management/warehouse-management/inventoryLoan"
        component={
          inventoryLoan?.isView ? InventoryLoanLandingNew : NotPermittedPage
        }
      />
      <ContentRoute
        path="/inventory-management/warehouse-management/inventory-Loan-Approve"
        component={
          inventoryLoanApprv?.isView
            ? InventoryLoanApproveLanding
            : NotPermittedPage
        }
      />

      <ContentRoute
        path="/inventory-management/warehouse-management/targetvsproductionrequset/entry"
        component={TargetVSProductionRequestForm}
      />
      <ContentRoute
        path="/inventory-management/warehouse-management/targetvsproductionrequset"
        component={TargetVSProductionRequest}
      />

      {/* Lifting Approve */}
      <ContentRoute
        path="/inventory-management/warehouse-management/liftingplanapprove"
        component={
          selectedBusinessUnit?.value === 175
            ? CastingScheduleApproveLanding
            : LiftingEntryApproveForm
        }
      />
      <ContentRoute
        path="/inventory-management/warehouse-management/liftingplanentry/entry/:id/:type"
        component={
          selectedBusinessUnit?.value === 175
            ? CastingScheduleForm
            : LiftingEntryForm
        }
      />
      <ContentRoute
        path="/inventory-management/warehouse-management/liftingplanentry/entry"
        component={
          selectedBusinessUnit?.value === 175
            ? CastingScheduleForm
            : LiftingEntryForm
        }
      />
      <ContentRoute
        path="/inventory-management/warehouse-management/liftingplanentry"
        component={
          selectedBusinessUnit?.value === 175
            ? CastingScheduleLanding
            : LiftingEntry
        }
      />
      <ContentRoute
        path="/inventory-management/warehouse-management/liftingplanreport"
        component={LiftingPlan}
      />
      <ContentRoute
        path="/inventory-management/warehouse-management/logisticequipmentavailability/:type"
        component={LogisticEquipmentEntry}
      />
      <ContentRoute
        path="/inventory-management/warehouse-management/logisticequipmentavailability"
        component={LogisticEquipment}
      />
      <ContentRoute
        path="/inventory-management/warehouse-management/InventoryAdjustment/create"
        component={InventoryAdjustmentCreate}
      />
      <ContentRoute
        path="/inventory-management/warehouse-management/InventoryAdjustment"
        component={InvAdjustment}
      />

      {/* Item Wise Serial Update Routing List*/}
      <ContentRoute
        path="/inventory-management/warehouse-management/Item-Wise-Serial-Update/edit/:id"
        component={
          itemWiseSerialUpdate?.isEdit ? ItemWiseSerialEdit : NotPermittedPage
        }
      />
      <ContentRoute
        path="/inventory-management/warehouse-management/Item-Wise-Serial-Update/create"
        component={
          itemWiseSerialUpdate?.isCreate
            ? ItemWiseSerialCreate
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/inventory-management/warehouse-management/Item-Wise-Serial-Update"
        component={
          itemWiseSerialUpdate?.isView ? ItemWiseSerialUpdate : NotPermittedPage
        }
      />
      <ContentRoute
        path="/inventory-management/warehouse-management/MRRCancel"
        component={mrrCancelPermission?.isView ? MRRCancel : NotPermittedPage}
      />

      <ContentRoute
        path="/inventory-management/warehouse-management/hallogrambasedelivery/:type/:id"
        component={HologramBaseDeliveryForm}
      />
      <ContentRoute
        path="/inventory-management/warehouse-management/hallogrambasedelivery/create"
        component={HologramBaseDeliveryForm}
      />
      <ContentRoute
        path="/inventory-management/warehouse-management/hallogrambasedelivery"
        component={HologramBaseDeliveryLanding}
      />

      <ContentRoute
        path="/inventory-management/warehouse-management/branditemrequisition/:type/:id"
        component={BrandItemRequisitionForm}
      />

      <ContentRoute
        path="/inventory-management/warehouse-management/branditemrequisition/entry"
        component={BrandItemRequisitionForm}
      />

      <ContentRoute
        path="/inventory-management/warehouse-management/branditemrequisition"
        component={BrandItemRequisitionLanding}
      />
      <ContentRoute
        path="/inventory-management/warehouse-management/inventory-Adjust-Approve"
        component={InventoryAdjustApprove}
      />
      <ContentRoute
        path="/inventory-management/warehouse-management/itemqualitycheck/create"
        component={QualityCheckCreateForm}
      />
      <ContentRoute
        path="/inventory-management/warehouse-management/itemqualitycheck/create-mrr"
        component={CreateMRR}
      />
      <ContentRoute
        path="/inventory-management/warehouse-management/itemqualitycheck"
        component={ItemQualityCheckLanding}
      />
      <ContentRoute
        from="/inventory-management/warehouse-management/ItemwiseserialDetails"
        component={ItemWiseSerialDetails}
      />
    </Switch>
  );
}
