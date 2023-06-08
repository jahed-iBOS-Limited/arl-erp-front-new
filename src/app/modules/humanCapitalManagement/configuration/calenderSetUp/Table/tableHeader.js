import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./tableRow";

export function CalenderSetUpTable() {
  return (
    <ITable
      link="/human-capital-management/calendar/calandersetup/create"
      title="Calendar Setup"
    >
      <TableRow />
    </ITable>
  );
}
