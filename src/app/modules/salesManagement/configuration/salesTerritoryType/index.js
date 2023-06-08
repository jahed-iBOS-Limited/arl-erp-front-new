import React from "react";
import { SalesTerritoryTypeTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export default function SalesTerritoryType({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/sales-management/configuration/sales_territorytype/edit/${id}`);
    },
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <SalesTerritoryTypeTable />
    </UiProvider>
  );
};
