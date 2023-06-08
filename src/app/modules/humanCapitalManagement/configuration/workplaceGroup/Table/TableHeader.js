import React from "react";
import { ITable } from "../../../../_helper/_table";
import TableRow from "./TableRow";

export function WorkplaceGroupTable() {
  return (
    <ITable
      link="/human-capital-management/hcmconfig/workplcgroup/create"
      title="Workplace Group"
    >
      <TableRow />
    </ITable>
  );
}
