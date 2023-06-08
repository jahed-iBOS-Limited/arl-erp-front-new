import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./tableRow";

export function KpiTargetTable() {
  return (
    <ITable
      link="/performance-management/sbu-kpi/target/create"
      title="SBU KPI LIST"
    >
      <TableRow />
    </ITable>
  );
}
