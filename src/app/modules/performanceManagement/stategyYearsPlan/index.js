import React from "react";
import { UiProvider } from "../../_helper/uiContextHelper";
import TableRow from "./landing/tableRow";
import "./style.css";

export function StrategicYearPlan({ history }) {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <TableRow />
    </UiProvider>
  );
}
