import React from "react";
import ICustomTable from "../../../../_helper/_customTable";

const CashRegisterReportTable = ({ rowDto, values, printRef }) => {
  const headers = [
    "SL",
    "Account Code",
    "Account Name",
    "Opening",
    "InFlow",
    "OutFlow",
    "Closing",
  ];
console.log("rowDtorowDto", rowDto);
  return (
    <div>
      {rowDto?.length > 0 && (
        <ICustomTable
          id={"table-to-xlsx"}
          ths={headers}
          className="table-font-size-sm"
        >
          {rowDto?.map((item, index) => {
            return (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <>
                  <td className="text-left" style={{ width: "80px" }}>
                    {item?.strAccountCode}
                  </td>
                  <td>{item?.strAccountName}</td>
                  <td className="text-right">{item?.numOpening}</td>
                  <td className="text-right">{item?.numInflow}</td>
                  <td className="text-right">{item?.numOutflow}</td>
                  <td className="text-right">{item?.numClosing}</td>
                </>
              </tr>
            );
          })}
          <tr>
            <td colSpan={3} className="text-right text-bold">
              <strong>Total</strong>
            </td>
            <td className="text-right text-bold">
              <strong>
                {rowDto
                  ?.reduce((a, b) => a + Number(b?.numOpening), 0)
                  .toFixed(2)}
              </strong>
            </td>
            <td className="text-right text-bold">
              <strong>
                {rowDto
                  ?.reduce((a, b) => a + Number(b?.numInflow), 0)
                  .toFixed(2)}
              </strong>
            </td>
            <td className="text-right text-bold">
              <strong>
                {rowDto
                  ?.reduce((a, b) => a + Number(b?.numOutflow), 0)
                  .toFixed(2)}
              </strong>
            </td>
            <td className="text-right text-bold">
              <strong>
                {rowDto
                  ?.reduce((a, b) => a + Number(b?.numClosing), 0)
                  .toFixed(2)}
              </strong>
            </td>
          </tr>
        </ICustomTable>
      )}
    </div>
  );
};

export default CashRegisterReportTable;
