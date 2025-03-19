import React from "react";
import ICustomTable from "../../../../../_helper/_customTable";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../../_helper/_formatMoney";

const AccountPayableAnalysisTable = ({ rowDto, values, printRef }) => {
  const headers = [
    "SL",
    "Code",
    "Supplier Name",
    "Debit",
    "Credit",
    "Outstanding",
    "Last Purchase Date",
    "Last Payment Date",
  ];

  return (
    <div ref={printRef}>
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
                  <td className="text-center" style={{ width: "80px" }}>
                    {item?.PartnerCode}
                  </td>
                  <td>{item?.PartnerName}</td>
                  <td className="text-right" style={{ width: "120px" }}>
                    {_formatMoney(item?.DebitBalance)}
                  </td>
                  <td className="text-right" style={{ width: "120px" }}>
                    {_formatMoney(item?.CreditAmount)}
                  </td>
                  <td className="text-right" style={{ width: "120px" }}>
                    {_formatMoney(item?.CurrentBalance) || ""}
                  </td>
                  <td>{_dateFormatter(item?.LastPurchaseDare)}</td>
                  <td>{_dateFormatter(item?.dteLastPayDate)}</td>
                  {/* <td className="text-right">{item?.TurnoverRatio || ""}</td>
                  <td className="text-right">
                    {365 / +item?.TurnoverRatio === Infinity
                      ? 0
                      : (365 / +item?.TurnoverRatio)?.toFixed(2) || ""}
                  </td> */}
                </>
              </tr>
            );
          })}
        </ICustomTable>
      )}
    </div>
  );
};

export default AccountPayableAnalysisTable;
