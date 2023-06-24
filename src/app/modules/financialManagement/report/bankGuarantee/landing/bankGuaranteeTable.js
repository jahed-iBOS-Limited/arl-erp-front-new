import React from "react";

export default function BankGuaranteeTable({ rowData }) {
  return (
    <div>
      <table className="table table-striped table-bordered bj-table bj-table-landing">
        <thead>
          <tr>
            <th>SL</th>
            <th>SBU</th>
            <th>Bank</th>
            <th>Bank Guarantee Number</th>
            <th>Beneficiary</th>
            <th>Issuing Date</th>
            <th>Ending Date</th>
            <th>T Days</th>
            <th>Currency</th>
            <th> BG Amounts</th>
            <th> Status</th>
            <th>Margin Ref.</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
