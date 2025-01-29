import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function CostCenterGroupTable() {
  return (
    <ITable
      title="Cost Center Group"
      link="/financial-management/cost-controlling/costcenter-group/add"
    >
      <TableRow/>
    </ITable>
  );
}
