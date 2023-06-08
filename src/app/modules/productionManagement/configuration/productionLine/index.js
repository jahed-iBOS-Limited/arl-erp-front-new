import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import ProductionLineTable from "./Table/TableHeader";

export default function ProductionLine({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(
        `/production-management/configuration/productionline/edit/${id}`
      );
    },
  };
  return (
    <UiProvider uIEvents={uIEvents}>
      <ProductionLineTable></ProductionLineTable>
    </UiProvider>
  );
}
