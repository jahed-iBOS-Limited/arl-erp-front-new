import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function ControllingUnitTable() {
  return (
    <ITable
      link="/financial-management/configuration/general-ladger/add"
      title="General Ladger"
    >
      <TableRow />
    </ITable>
  );
}
