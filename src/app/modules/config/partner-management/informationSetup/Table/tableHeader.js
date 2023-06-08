import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./tableRow";

export function ProfileSetupTable() {
  return (
    <ITable
      link="/config/partner-management/partner-info-setup/add"
      title="Partner Information Setup"
    >
      <TableRow />
    </ITable>
  );
}
