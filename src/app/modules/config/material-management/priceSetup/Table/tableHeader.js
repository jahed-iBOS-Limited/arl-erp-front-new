import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function PriceSetupTable() {
  return (
    <ITable
      link="/config/material-management/pricesetup/add"
      title="Price Setup"
    >
      <TableRow />
    </ITable>
  );
}
