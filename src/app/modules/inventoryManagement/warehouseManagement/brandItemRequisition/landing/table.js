import React from "react";

export default function BrandItemRequisitionLandingTable({ obj }) {
  const { rowData } = obj;
  return (
    <>
      {rowData?.length > 0 && (
        <table className="table table-striped table-bordered bj-table bj-table-landing">
          <thead>
            <tr>
              <th style={{ width: "30px" }}>SL</th>
              <th>Region</th>
              <th>Item Name</th>
              <th>Target Year</th>
              <th>Target Month</th>
              <th>Target Quantity</th>
              <th>Requisition Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rowData?.map((td, index) => (
              <tr key={index}>
                <td className="text-center">{td?.sl}</td>
                <td>
                  <div className="pl-2">{td?.nl5}</div>
                </td>
                <td>
                  <div className="pl-2">{td?.strItemName}</div>
                </td>
                <td>
                  <div className="pl-2">{td?.targetYearId}</div>
                </td>
                <td></td>

                <td>
                  <div className="pl-2">{td?.numTargetQuantity}</div>
                </td>
                <td>
                  <div className="pl-2">{td?.numRequisitionQuantity}</div>
                </td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
