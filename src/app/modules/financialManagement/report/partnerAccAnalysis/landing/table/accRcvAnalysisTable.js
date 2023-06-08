import React from "react";
import ICustomTable from "../../../../../_helper/_customTable";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../../_helper/_formatMoney";

const AccRcvAnalysisTable = ({ rowDto, values, printRef }) => {
  const headers = [
    "SL",
    "Code",
    "Name",
    "Channel Category",
    "Days",
    "Bank Gurranty",
    "Present Cr. Limit",
    "Approved OD",
    "Total Cr. Limit",
    "Debit",
    "Credit",
    "Outstanding",
    "Last Del. Date",
    "Last Col. Date",
    "Total Sales",
    "Turnover Ratio",
    "Avg. Col. Days",
  ];

  return (
    <div ref={printRef}>
      {rowDto?.length > 0 && (
        <ICustomTable id={"table-to-xlsx"} ths={headers} className="table-font-size-sm">
          {rowDto?.map((item, index) => {
            return (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td className="text-center" style={{ width: "80px" }}>
                  {item?.PartnerCode}
                </td>
                <td>{item?.PartnerName}</td>
                <td>{item?.strChannel}</td>
                <td>{item?.numDays}</td>
                <td>{item?.numBankGurranty}</td>
                <td>{item?.numCrLimit}</td>
                <td className="text-right">{_formatMoney(item?.numODAmount)}</td>
                <td className="text-right">{_formatMoney(item?.TotalCreditLimit)}</td>
                <td className="text-right">{_formatMoney(item?.numDebit)}</td>
                <td className="text-right">{_formatMoney(item?.numCredit)}</td>
                <td className="text-right">{_formatMoney(item?.CurrentBalance)}</td>
                <td>{_dateFormatter(item?.dteLastDelDate)}</td>
                <td>{_dateFormatter(item?.dteLastPayDate)}</td>
                <td className="text-right">{_formatMoney(item?.TotalSales) || ""}</td>
                <td className="text-right">{item?.TurnoverRatio || ""}</td>
                <td className="text-center">{item?.AvgCollDays}</td>
                {/* <td className="text-right">{365 / +item?.TurnoverRatio === Infinity ? 0 : (365 / +item?.TurnoverRatio)?.toFixed(2) || ""}</td> */}
              </tr>
            );
          })}
        </ICustomTable>
      )}
    </div>
  );
};

export default AccRcvAnalysisTable;
