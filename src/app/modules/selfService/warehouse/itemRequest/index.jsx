import React from "react";
import { ItemRequestTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";
import './purchaseInvoice.css'

export function ItemRequest({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/self-service/store-requisition/edit/${id}`);
    },
    openViewDialog: (id) => {
      history.push(`/self-service/store-requisition/view/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <ItemRequestTable />
    </UiProvider>
  );
};
