import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function SalesQuotationTable() {
  return (
    <ITable
      link="/sales-management/ordermanagement/salesquotation/add"
      title="Sales Quotation"
    >
      <TableRow />
    </ITable>
  );
}
