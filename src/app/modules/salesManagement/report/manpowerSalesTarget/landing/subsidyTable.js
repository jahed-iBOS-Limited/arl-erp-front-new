import React from "react";
import ICustomTable from "../../../../_helper/_customTable";
import IEdit from "../../../../_helper/_helperIcons/_edit";

const headers = ["SL", "Month", "Rate", "Action"];

export default function SubsidyTable({ obj }) {
  const { rowData } = obj;
  return (
    <>
      <ICustomTable ths={headers}>
        {rowData?.map((row, index) => (
          <tr key={index}>
            <td className="text-center" style={{ width: "40px" }}>
              {index + 1}
            </td>
            <td>{row?.targetMonthName}</td>
            <td className="text-right">{row?.targeQnt}</td>
            <td className="text-center">
              <IEdit />
            </td>
          </tr>
        ))}
      </ICustomTable>
    </>
  );
}
