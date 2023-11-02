import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IEdit from "../../../../_helper/_helperIcons/_edit";

export default function BrandItemRequisitionLandingTable({ obj }) {
  const { rowData } = obj;
  return (
    <>
      {rowData?.data?.length > 0 && (
        <table className="table table-striped table-bordered bj-table bj-table-landing">
          <thead>
            <tr>
              <th style={{ width: "30px" }}>SL</th>
              <th>Program Type</th>
              <th>Request Code</th>
              <th>Area Name</th>
              {/* <th>Territory</th>
              <th>Item Name</th>
              <th>Item Code</th>
              <th>UoM</th> */}
              <th>Requested Quantity</th>
              <th>Required Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rowData?.data?.map((td, index) => (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td>{td?.brandRequestTypeName}</td>
                <td>{td?.brandRequestCode}</td>
                <td>{td?.areaName}</td>
                {/* <td>{td?.territoryName}</td>
                <td>{td?.itemName}</td>
                <td>{td?.itemCode}</td>
                <td>{td?.uoMname}</td> */}
                <td>{td?.requestQuantity}</td>
                <td>{_dateFormatter(td?.requiredDate)}</td>
                <td className="text-center">
                  <IEdit />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
