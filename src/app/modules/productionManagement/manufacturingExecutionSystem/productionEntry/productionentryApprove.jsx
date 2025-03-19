import React from "react";

import { UiProvider } from "../../../_helper/uiContextHelper";
import ProductionEntryApproveTable from "./Table/ProductionEntryApproveTable";

export default function ProductionEntryApprove() {
  return (
    <UiProvider>
      <ProductionEntryApproveTable />
    </UiProvider>
  );
}
