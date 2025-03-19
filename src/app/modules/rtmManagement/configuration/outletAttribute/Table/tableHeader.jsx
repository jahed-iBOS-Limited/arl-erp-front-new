import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./tableRow";

export function OutletAttributeTable() {
  return (
    <ITable
      link="/rtm-management/configuration/outletAttribute/add"
      title="Outlet Attribute"
    >
      <TableRow />
    </ITable>
  );
}
