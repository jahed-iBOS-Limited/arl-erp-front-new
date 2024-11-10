import React from "react";

export default function SalesInfoTable({ rowData }) {
  return (
    <div>
      <h6 className="mb-0 mt-3">Sales Info (sold outside allotment)</h6>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table table-font-size-sm">
          <thead>
            <tr>
              <th style={{ width: "30px" }}>SL</th>
              <th>Fertilizer Name</th>
              <th>LC No</th>
              <th>Date</th>
              <th>Dealer Name</th>
              <th>Dealer Address</th>
              <th>Sold Quanitty (MT)</th>
            </tr>
          </thead>

          <tbody>
            {rowData?.map((item, index) => (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td>{item?.salesOrderCode}</td>
                <td className="text-center">{item?.orderQty}</td>
                <td className="text-center">{item?.pendingQty}</td>
                <td>{item?.deliveryCode}</td>
                <td className="text-center">{item?.deliveryQty}</td>
                <td>{item?.shipmentCode}</td>
                <td className="text-center">{item?.shipmentQty}</td>
                <td>{item?.shipmentCompleteCode}</td>
                <td className="text-center">{item?.shipmentCompleteQty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
