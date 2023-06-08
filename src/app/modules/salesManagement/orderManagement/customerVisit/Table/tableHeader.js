import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function CustomerVisitTable() {
  return (
    <ITable
      link="/sales-management/ordermanagement/customerVisit/create"
      title="Customer Visit"
    >
      <TableRow />
    </ITable>
  );
}
