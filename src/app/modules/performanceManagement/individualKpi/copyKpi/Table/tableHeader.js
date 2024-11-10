import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./tableRow";

export function KpiTargetTable() {
  return (
    <ITable
      link="/performance-management/individual-kpi/individual-kpi-target/create"
      title="INDIVIDUAL KPI LIST"
    >
      <TableRow />
    </ITable>
  );
}
