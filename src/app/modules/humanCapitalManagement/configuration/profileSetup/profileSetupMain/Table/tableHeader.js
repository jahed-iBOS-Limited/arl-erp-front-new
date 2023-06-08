import React from "react";
import { ITable } from "../../../../../_helper/_table";
import { TableRow } from "./tableRow";

export function ProfileSetupTable() {
  return (
    <ITable
      link="/human-capital-management/hcmconfig/profile-setup/add"
      title="Profile Setup"
    >
      <TableRow />
    </ITable>
  );
}
