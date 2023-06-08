import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function CostCenterTypeTable() {
  return (
    <ITable
      link="/financial-management/cost-controlling/costcenter-type/add"
      title="Cost Center Type"
    >
      <TableRow />
    </ITable>
  );
}
