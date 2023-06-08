import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./tableRow";

export function LeaveTypeLanding() {
  return (
    <ITable
      link="/human-capital-management/leavemovement/leaveType/create"
      title="Leave Type"
    >
      <TableRow />
    </ITable>
  );
}
