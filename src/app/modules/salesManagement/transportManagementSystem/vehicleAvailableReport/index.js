import React from "react";
import { PurchaseInvoiceTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";
import './purchaseInvoice.css'

export function ItemRequest({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/inventory-management/warehouse-management/item-request/edit/${id}`);
    },
    openViewDialog: (id) => {
      history.push(`/inventory-management/warehouse-management/item-request/view/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <PurchaseInvoiceTable />
    </UiProvider>
  );
};
