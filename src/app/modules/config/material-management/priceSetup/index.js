import React from "react";
import { PriceSetupTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export default function PriceSetup({ history }) {

  return (
    <UiProvider>
      <PriceSetupTable />
    </UiProvider>
  );
};
