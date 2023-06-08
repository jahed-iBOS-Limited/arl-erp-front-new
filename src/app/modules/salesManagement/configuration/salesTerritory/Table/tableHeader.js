import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function SalesTerritoryTable() {
  return (
    <ITable
      link="/sales-management/configuration/salesterritory/add"
      title="Sales Territory"
    >
      <TableRow />
    </ITable>
  );
}
