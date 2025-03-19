import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function ShippingPointTable() {
  return (
    <ITable
      link="/inventory-management/configuration/shippingpoint/add"
      title="Shipping Point"
    >
      <TableRow />
    </ITable>
  );
}
