import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function ChequePrintTable() {
  return (
    <ITable
      link="/financial-management/configuration/chequePrintSetup/add"
      title="Cheque Print Setup"
    >
      <TableRow />
    </ITable>
  );
}
