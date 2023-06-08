import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function ProductDivisionTypeTable() {
  return (
    <ITable
      link="/sales-management/configuration/product_divisiontype/add"
      title="Product Division Type"
    >
      <TableRow />
    </ITable>
  );
}
