import React from "react";
import { ITable } from "../../../../../../_helper/_table";
import { TableRow } from "./tableRow";

export function LoadUnloadBillConfigTable() {
  return (
    <ITable
      link="/sales-management/configuration/loadunloadbillconfig/add"
      title="Load Unload Bill Config"
    >
      <TableRow />
    </ITable>
  );
}
