import React from "react";
import { ProductDivisionTypeTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function ProductDivisionType({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/sales-management/configuration/product_divisiontype/edit/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <ProductDivisionTypeTable />
    </UiProvider>
  );
};
