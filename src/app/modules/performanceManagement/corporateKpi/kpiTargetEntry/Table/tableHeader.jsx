import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./tableRow";

export function KpiTargetTable() {
  return (
    <ITable
      link="/performance-management/corporate-kpi/target/create"
      title="CORPORATE KPI LIST"
    >
      <TableRow />
    </ITable>
  );
}
