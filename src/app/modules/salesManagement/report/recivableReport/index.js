import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { TableRow } from "./Table/tableRow";
import "./style.css";

export default function RecivableDueReport({ history }) {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <TableRow />
    </UiProvider>
  );
}
