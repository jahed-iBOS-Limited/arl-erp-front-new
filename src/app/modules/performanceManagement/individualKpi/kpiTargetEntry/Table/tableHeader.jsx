import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./tableRow";
import Help from "./../../../help/Help";

export function KpiTargetTable() {
  return (
    <ITable
      link="/performance-management/individual-kpi/individual-kpi-target/create"
      title="INDIVIDUAL KPI LIST"
      isHelp={true}
      helpModalComponent={<Help />}
    >
      <TableRow />
    </ITable>
  );
}
