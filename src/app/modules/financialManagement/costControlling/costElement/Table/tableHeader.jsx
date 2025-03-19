import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function CostElementTable() {
  return (
    <ITable
      link="/financial-management/cost-controlling/costelement/add"
      title="Cost Element"
    >
      <TableRow />
    </ITable>
  );
}
