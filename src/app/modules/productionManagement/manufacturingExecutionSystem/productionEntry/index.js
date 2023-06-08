import React from "react";

import { UiProvider } from "../../../_helper/uiContextHelper";
import ProductionEntryTable from "./Table/TableHeader";

export default function ProductionEntry({ history }) {
  return (
    <UiProvider>
      <ProductionEntryTable />
    </UiProvider>
  );
}
