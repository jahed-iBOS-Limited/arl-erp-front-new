import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function LoadingPointTable() {
  return (
    <ITable
      link="/inventory-management/configuration/loadingpoint/add"
      title="Loading Point"
    >
      <TableRow />
    </ITable>
  );
}
