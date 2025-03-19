import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function ProfitCenterGroupTable() {
  return (
    <ITable
      link="/financial-management/cost-controlling/profit-center-group/add"
      title="Profit Center Group"
    >
      <TableRow />
    </ITable>
  );
}
