import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./tableRow";

export function InformationSectionTable() {
  return (
    <ITable
      link="/config/partner-management/partner-info-section/add"
      title="Partner Information Section"
    >
      <TableRow />
    </ITable>
  );
}
