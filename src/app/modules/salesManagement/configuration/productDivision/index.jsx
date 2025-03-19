import React from "react";
import { ProductDivisionTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export default function ProductDivision({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(
        `/sales-management/configuration/productdivision/edit/${id}`
      );
    },
  };
  return (
    <UiProvider uIEvents={uIEvents}>
      <ProductDivisionTable />
    </UiProvider>
  );
}
