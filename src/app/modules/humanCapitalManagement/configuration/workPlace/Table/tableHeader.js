import React from "react";
import { ITable } from "../../../../_helper/_table";
import TableRow from "./tableRow";

export function WorkPlaceTable() {
  return (
    <ITable
      title="Workplace"
      link='/human-capital-management/hcmconfig/workplace/create'
    >
      <TableRow />
    </ITable>
  );
}
