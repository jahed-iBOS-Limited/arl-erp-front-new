import React, { useState } from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function CheckPostTable() {
  const [rowDto, setRowDto] = useState([]);
  return (
    <ITable
      link="/transport-management/routecostmanagement/checkpost/add"
      title="Check Post In-Out"
    >
      <TableRow rowDto={rowDto} setRowDto={setRowDto} />
    </ITable>
  );
}
