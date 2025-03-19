import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function ProductDivisionTable() {
  return (
    <ITable
      link="/sales-management/configuration/productdivision/add"
      title="Product division"
    >
      <TableRow />
    </ITable>
  );
}
