import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./tableRow";

export function PrimaryCollectionTable() {
  return (
    <ITable
      link="/rtm-management/primarySale/primaryCollection/add"
      title="Primary Collection"
    >
      <TableRow />
    </ITable>
  );
}
