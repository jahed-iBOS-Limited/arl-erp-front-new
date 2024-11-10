import React from "react";

export default function CurrentStockMokamOrWarehouseInfoTable({ rowData }) {
  return (
    <div>
      <h6 className="mb-0 mt-3">Mokam/Warehouse Info Current Stock</h6>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table table-font-size-sm">
          <thead>
            <tr>
              <th style={{ width: "30px" }} rowSpan="2">
                SL
              </th>
              <th style={{ width: "100px" }} rowSpan="2">
                Fertilizer Name
              </th>
              <th style={{ width: "100px" }} rowSpan="2">
                LC No
              </th>
              <th rowSpan="2" colSpan="2">
                Fertilizer Quantity (MT)
              </th>
            </tr>
            <tr>
              <th colSpan="1" rowSpan="1">
                Code
              </th>
              <th colSpan="1" rowSpan="1">
                Qty
              </th>
              <th colSpan="1" rowSpan="1">
                Code
              </th>
              <th colSpan="1" rowSpan="1">
                Qty
              </th>
              <th colSpan="1" rowSpan="1">
                Code
              </th>
              <th colSpan="1" rowSpan="1">
                Qty
              </th>
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
