import moment from "moment";
import React from "react";

export function UnApprovedList(props) {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th>SL</th>
            <th>Area</th>
            <th>Date</th>
            <th>Item</th>
            <th>Lifting Qty</th>
            <th>Approve Qty</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {props.rowData?.map((td, index) => (
            <tr key={index}>
              <td className="text-center">{index + 1}</td>
              <td>
                <div className="pl-1">{td?.strNl6}</div>
              </td>
              <td>
                <div className="pl-2">
                  {moment(td?.dteFromDate).format("LL")}
                </div>
              </td>
              <td>
                <div className="pl-1">{td?.strItemName}</div>
              </td>
              <td className="text-right">{td?.numTargetQuantity}</td>
              <td className="text-right">{td?.numApproveQuantity}</td>
              <td>{td?.strRemarks}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="4" className="text-right">
              Total
            </td>
            <td colSpan="1" className="text-right">
              {props?.rowData?.reduce(
                (acc, obj) => acc + +obj?.numTargetQuantity,
                0
              )}
            </td>
            <td colSpan="1" className="text-right">
              {props?.rowData?.reduce(
                (acc, obj) => acc + +obj?.numApproveQuantity,
                0
              )}
            </td>
            <td colSpan="1"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
