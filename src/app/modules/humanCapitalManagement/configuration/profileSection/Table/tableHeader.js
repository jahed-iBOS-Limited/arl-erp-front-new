import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./tableRow";

export function ProfileSectionTable() {
  return (
    <ITable
      link="/human-capital-management/hcmconfig/profile-section/add"
      title="Profile Section"
    >
      <TableRow />
    </ITable>
  );
}
