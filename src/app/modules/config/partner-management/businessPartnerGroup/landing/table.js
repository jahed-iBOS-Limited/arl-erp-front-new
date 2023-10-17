import React from "react";

export default function BusinessPartnerGroupLandingTable({ obj }) {
  const { rowData } = obj;
  return (
    <>
      {rowData?.data?.data?.length > 0 && (
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th style={{ width: "50px" }}>SL</th>
              <th>Partner Name</th>
              <th>Partner Group</th>
            </tr>
          </thead>
          <tbody>
            {rowData?.data?.data?.map((item, i) => (
              <tr key={i + 1}>
                <td>{i + 1}</td>
                <td>{item?.businessPartneName}</td>
                <td>{item?.businessPartnerGroupName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
