import React from "react";
import { _formatMoney } from "../../../../_helper/_formatMoney";

export default function PumpFoodingBillReportTbl({ rowData, values }) {
  let totalBillAmount = 0;
  let totalApproveAmount = 0;

  return (
    <div className="mt-5">
      <table className="table table-striped table-bordered bj-table bj-table-landing">
        <thead>
          <tr>
            <th>SL</th>
            <th>Enroll</th>
            <th>Name</th>
            <th>Warehouse/Plant</th>
            <th>Designation</th>
            <th>Pending</th>
            <th>Approved</th>
          </tr>
        </thead>
        <tbody>
          {rowData?.map((item, index) => {
            totalBillAmount += +item?.numBillAmount || 0;
            totalApproveAmount += +item?.numApproveAmount || 0;
            return (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td className="text-center">{item?.intEmployeeId}</td>
                <td>{item?.strEmployeeName}</td>
                <td>{item?.strWareHouseName}</td>
                <td>{item?.strDesignation}</td>
                <td className="text-right">
                  {_formatMoney(item?.numBillAmount)}
                </td>
                <td className="text-right">
                  {_formatMoney(item?.numApproveAmount)}
                </td>
              </tr>
            );
          })}
          <tr>
            <td colSpan={5} className="text-right">
              <strong>Grand Total</strong>
            </td>
            <td className="text-right">{_formatMoney(totalBillAmount)}</td>
            <td className="text-right">{_formatMoney(totalApproveAmount)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
