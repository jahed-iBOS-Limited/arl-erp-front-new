import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function CodeGenerateTable() {
  return (
    <ITable
      link="/config/domain-controll/code-generate/add"
      title="Code Generate"
    >
      <TableRow />
    </ITable>
  );
}
