import React from "react";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";
import SearchForAuditReport from "./search";

function ExportSalesTable({ rowDto, setRowDto, gridAllData }) {
  let totalQty = 0,
    totalSales = 0,
    totalVat = 0,
    totalSd = 0,
    grandTotal = 0;
  return (
    <>
      <SearchForAuditReport
        rowDto={rowDto}
        setRowDto={setRowDto}
        gridAllData={gridAllData}
      />
      <div className="react-bootstrap-table table-responsive">
        <table
          className="table table-striped table-bordered global-table"
          id="table-to-xlsx"
        >
          <thead>
            <tr>
              <th>SL </th>
              <th>Supply Type </th>
              <th>Trade Type </th>
              <th>Sales Code</th>
              <th>Custom House </th>
              <th>Custom House Code </th>
              <th>HS Code </th>
              <th>Customer Name</th>
              <th>Customer Address</th>
              <th>Total Qty </th>
              <th>Total Sales</th>
              <th>Total Vat</th>
              <th>Total Sd</th>
              <th>Grand Total</th>
            </tr>
          </thead>
          {rowDto?.length > 0 && (
            <tbody>
              {rowDto?.map((item, index) => {
                totalQty += +item?.totalQty || 0;
                totalSales += +item?.totalSales || 0;
                totalVat += +item?.totalVat || 0;
                totalSd += +item?.totalSd || 0;
                grandTotal += +item?.grandTotal || 0;
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{item?.supplyType}</td>
                    <td>{item?.tradeType}</td>
                    <td>{item?.salesCode}</td>
                    <td>{item?.customHouse}</td>
                    <td>{item?.customhouseCode}</td>
                    <td>{item?.hsCode}</td>
                    <td>{item?.customerName}</td>
                    <td>{item?.customerAddress}</td>

                    <td className="text-right">
                      {_fixedPoint(item?.totalQty)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(item?.totalSales)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(item?.totalVat)}
                    </td>
                    <td className="text-right">{_fixedPoint(item?.totalSd)}</td>

                    <td className="text-right">
                      {_fixedPoint(item?.grandTotal)}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td className="text-right" colspan="9">
                  <b>Total</b>
                </td>
                <td className="text-right">
                  <b>{_fixedPoint(totalQty)}</b>
                </td>
                <td className="text-right">
                  <b>{_fixedPoint(totalSales)}</b>
                </td>
                <td className="text-right">
                  <b>{_fixedPoint(totalVat)}</b>
                </td>
                <td className="text-right">
                  <b>{_fixedPoint(totalSd)}</b>
                </td>

                <td className="text-right">
                  <b>{_fixedPoint(grandTotal)}</b>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </>
  );
}

export default ExportSalesTable;
