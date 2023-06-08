import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function SalesTerritoryTypeTable() {
  return (
    <ITable
      link="/sales-management/configuration/sales_territorytype/add"
      title="Sales Territory Type"
    >
      <TableRow />
    </ITable>
  );
}
