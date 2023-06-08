import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./tableRow";

export function SalesInvoiceLanding() {
  return (
    <ITable link="/pos-management/sales/sales-invoice/create" title="Sales Invoice">
      <TableRow />
    </ITable>
  );
}
