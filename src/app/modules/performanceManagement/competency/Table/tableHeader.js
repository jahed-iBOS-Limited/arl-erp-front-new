import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../_helper/_table";

export function CompetencyTable() {
  return (
    <ITable
      link="/performance-management/configuration/core_competencies/create"
      title="COMPETENCY"
    >
      <TableRow />
    </ITable>
  );
}
