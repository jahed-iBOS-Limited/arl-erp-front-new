import React from "react";
import ICustomTable from "../../../../_helper/_customTable";
import IDelete from "../../../../_helper/_helperIcons/_delete";

const tableHeader = [
  "SL",
  "Business Unit Name",
  "Workplace Code",
  "Workplace",
  "Action",
];

export default function TableRowCreatePage({ rowData, deleteHandler }) {
  return (
    <ICustomTable ths={tableHeader}>
      <>
        {rowData.map((data, index) => (
          <tr key={index}>
            <td style={{ textAlign: "center" }}>{index + 1}</td>
            <td style={{ textAlign: "left" }}>{data.businessUnitName}</td>
            <td style={{ textAlign: "left" }}>{data.workplaceCode}</td>
            <td style={{ textAlign: "left" }}>{data.workplaceName}</td>
            <td style={{ textAlign: "center" }}>
              <span onClick={() => deleteHandler(index)}>
                <IDelete />
              </span>
            </td>
          </tr>
        ))}
      </>
    </ICustomTable>
  );
}
