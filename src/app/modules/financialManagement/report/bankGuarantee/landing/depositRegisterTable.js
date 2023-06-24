import React from "react";

export default function DepositRegisterTable({ rowData }) {
  return (
    <div>
      <table className="table table-striped table-bordered bj-table bj-table-landing">
        <thead>
          <tr>
            <th>SL</th>
            <th>SBU</th>
            <th>Bank</th>
            <th>Security Type</th>
            <th>No.</th>
            <th>Issue Date</th>
            <th>Retirement Date</th>
            <th>Amount</th>
            <th>In Fav. Of</th>
            <th>Purpose</th>
            <th>Responsible person to return</th>
            <th>Note</th>
            <th>Attachment</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rowData.map((item, i) => (
            <tr key={i}>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
