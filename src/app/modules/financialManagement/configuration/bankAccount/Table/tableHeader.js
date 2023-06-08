import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function BankAccountTable() {
  return (
    <ITable
      link="/financial-management/configuration/bank-account/add"
      title="Bank Account"
    >
      <TableRow />
    </ITable>
  );
}
