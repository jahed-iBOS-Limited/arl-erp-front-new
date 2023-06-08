import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./tableRow";

export function KpiTargetTable() {
  return (
    <ITable
      link="/performance-management/departmental-kpi/target/create"
      title="DEPARTMENTAL KPI LIST"
    >
      <TableRow />
    </ITable>
  );
}
