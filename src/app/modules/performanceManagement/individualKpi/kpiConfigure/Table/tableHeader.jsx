import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./tableRow";

export function KpiConfigureLandingTable() {
  return (
    <ITable
      link="/performance-management/individual-kpi/kpi-configure/create"
      title="KPI Configure"
    >
      <TableRow />
    </ITable>
  );
}
