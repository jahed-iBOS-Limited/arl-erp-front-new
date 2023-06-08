import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../_helper/_table";

export function PmsDimensionTable() {
  return (
    <ITable link="/performance-management/configuration/pms-dimension/create" title="PMS DIMENSION">
      <TableRow />
    </ITable>
  );
}
