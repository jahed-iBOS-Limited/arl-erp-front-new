import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { ShopFloorTable } from "./table/tableHeader";

export function ShopFloor() {

  return (
    <UiProvider>
        <ShopFloorTable />
    </UiProvider>
  );
};
