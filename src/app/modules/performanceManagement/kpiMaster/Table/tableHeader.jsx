import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../_helper/_table";

export function KpiTargetTable() {
  return (
    <ITable
      link="/performance-management/configuration/kpiMasterData/create"
      title="KPI MASTER DATA"
    >
      <TableRow />
    </ITable>
  );
}
