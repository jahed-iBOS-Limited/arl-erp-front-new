import React from "react";
import { InventoryTransactionTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";
import "./style.css";

export function GrnforPO({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(
        `/inventory-management/warehouse-management/inventorytransaction/edit/${id}`
      );
    },
  };

  return (
    <div className="inventory_traction">
      <UiProvider uIEvents={uIEvents}>
        <InventoryTransactionTable />
      </UiProvider>
    </div>
  );
}
