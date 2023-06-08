import React from "react";

export default function LoanRescheduleReportViewForm({ data }) {
  return (
    <>
      <table className="table table-striped table-bordered my-5 bj-table bj-table-landing">
        <thead>
          <tr>
            <th style={{ width: "30px" }}>SL</th>
            <th style={{ width: "50px" }}>Remuneration Name</th>
            <th style={{ width: "50px" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data?.length >= 0 &&
            data?.map((data, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{data.remunerationComName}</td>
                <td className="text-right">{data.numAmount}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
