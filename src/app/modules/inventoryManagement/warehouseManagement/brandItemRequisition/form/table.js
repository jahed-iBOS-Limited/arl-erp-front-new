import React from "react";
import IDelete from "../../../../_helper/_helperIcons/_delete";

export default function BrandItemRequisitionEntryTable({ obj }) {
  const { rowData, removeRow, type } = obj;
  return (
    <>
      {rowData?.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered bj-table bj-table-landing">
            <thead>
              <tr>
                <th style={{ width: "30px" }}>SL</th>
                <th>Item Name</th>
                <th>Item Code</th>
                <th>UoM</th>
                <th>Requested Quantity</th>
                <th>Channel</th>
                <th>Territory</th>
                <th>Remarks</th>
                {type !== "view" && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {rowData?.map((td, index) => (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{td?.itemName}</td>
                  <td>{td?.itemCode}</td>
                  <td>{td?.uoMname}</td>
                  <td className="text-right">{td?.requestQuantity}</td>
                  <td>{td?.channelName}</td>
                  <td>{td?.territoryName}</td>
                  <td>{td?.remarks}</td>

                  {type !== "view" && (
                    <td className="text-center">
                      <IDelete remover={removeRow} id={index} />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
