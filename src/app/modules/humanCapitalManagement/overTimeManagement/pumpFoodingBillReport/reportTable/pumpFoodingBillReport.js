import React from "react";
import { _formatMoney } from "../../../../_helper/_formatMoney";

export default function PumpFoodingBillReportTbl({ rowData, values }) {
  return (
    <div className="mt-5">
      <table className="table table-striped table-bordered bj-table bj-table-landing">
        <thead>
          <tr>
            <th>SL</th>
            <th>Employee Name</th>
            <th>Designation</th>
            <th>Bill Amount</th>
            <th>Approve Amount</th>
          </tr>
        </thead>
        <tbody>
          {rowData?.map((item, index) => (
            <tr key={index}>
              <td className="text-center">{index + 1}</td>
              <td>{item?.strEmployeeName}</td>
              <td>{item?.strDesignation}</td>
              <td className="text-right">
                {_formatMoney(item?.numBillAmount)}
              </td>
              <td className="text-right">
                {_formatMoney(item?.numApproveAmount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
