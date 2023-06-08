import React from "react";
import { CheckPostTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function CheckPost({ history }) {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <>
        <CheckPostTable />
      </>
    </UiProvider>
  );
}
