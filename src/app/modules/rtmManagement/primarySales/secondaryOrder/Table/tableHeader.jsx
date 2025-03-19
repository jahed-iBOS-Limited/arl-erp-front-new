import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./tableRow";

export function SecondaryOrderTable() {
  return (
    <ITable
      link="/rtm-management/primarySale/secondaryOrder/add"
      title="Retail Order"
    >
      <TableRow />
    </ITable>
  );
}
