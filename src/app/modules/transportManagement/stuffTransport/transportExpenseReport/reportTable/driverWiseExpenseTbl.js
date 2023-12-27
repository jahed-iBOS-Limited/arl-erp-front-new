import React from "react";

export default function DriverWiseExpenseTbl({ rowData }) {
  return (
    <div>
      <h4 className="text-center mt-5">
        <strong>Driver Date Wise Expense</strong>
      </h4>
      <table className="table table-striped table-bordered bj-table bj-table-landing">
        <thead>
          <tr>
            <th>SL</th>
            <th>Date</th>
            <th>Toll</th>
            <th>Food</th>
            <th>Others</th>
            <th>Maintaince</th>
            <th>Total Driver Expense</th>
          </tr>
        </thead>
        <tbody>
          {rowData?.map((item, index) => (
            <tr>
              <td>SL</td>
              <td>Date</td>
              <td>Toll</td>
              <td>Food</td>
              <td>Others</td>
              <td>Maintaince</td>
              <td>Total Driver Expense</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
