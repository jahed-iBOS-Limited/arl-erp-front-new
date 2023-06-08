import React from "react";
import { ITable } from "../../../_helper/_table";
import TableRowTwo from "./tableRowTwo";

export function StrategicParticularsTable() {
  return (
    <ITable
      link="/performance-management/str/strategic_particulars/create"
      title="STRATEGIC PLAN"
    >
      <TableRowTwo />
    </ITable>
  );
}
