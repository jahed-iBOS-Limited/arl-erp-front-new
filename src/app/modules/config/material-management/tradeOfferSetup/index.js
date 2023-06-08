import React from "react";
import { TradeOfferTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function TradeOfferSetup({ history }) {

  return (
    <UiProvider>
      <TradeOfferTable />
    </UiProvider>
  );
};
