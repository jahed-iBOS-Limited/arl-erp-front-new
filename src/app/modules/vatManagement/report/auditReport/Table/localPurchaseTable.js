import React from "react";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";

function LocalPurchaseTable({ rowDto }) {
  let totalQty = 0,
    totalVat = 0,
    totalSd = 0,
    grandTotal = 0,
    totalPurchase = 0,
    rebateTotal = 0;

  return (
    <>
      <div className="react-bootstrap-table table-responsive">
        <table
          className="table table-striped table-bordered global-table"
          id="table-to-xlsx"
        >
          <thead>
            <tr>
              <th>SL </th>
              <th>Purchase Code </th>
              <th>Purchase Date </th>
              <th>Challan No </th>
              <th>Challan Date </th>
              <th>Branch Name </th>
              <th>Supply Type </th>
              <th>Trade Type </th>
              <th>Supplier Name</th>
              <th>HS Code </th>
              <th>BIN No</th>
              <th>Total Quantity </th>
              <th>Total Amount </th>
              <th>Total SD </th>
              <th>Total VAT </th>
              <th>Total Rebate</th>
              <th>Grand Total </th>
            </tr>
          </thead>
          {rowDto?.length > 0 && (
            <tbody>
              {rowDto?.map((item, index) => {
                totalQty += +item?.totalQty || 0;
                totalPurchase += +item?.totalPurchase || 0;
                totalSd += +item?.totalSd || 0;
                totalVat += +item?.totalVat || 0;
                rebateTotal += +item?.rebateTotal || 0;
                grandTotal += +item?.grandTotal || 0;
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{_dateFormatter(item?.purchaseDate)}</td>
                    <td>{item?.taxPurchaseCode}</td>
                    <td>{item?.referanceNo}</td>
                    <td>{_dateFormatter(item?.referanceDate)}</td>
                    <td>{item?.taxBranchName}</td>
                    <td>{item?.supplyType}</td>
                    <td>{item?.tradeType}</td>
                    <td>{item?.supplierName}</td>
                    <td>{item?.hsCode}</td>
                    <td>{item?.binNo}</td>
                    <td className="text-right">
                      {_fixedPoint(item?.totalQty)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(item?.totalPurchase)}
                    </td>
                    <td className="text-right">{_fixedPoint(item?.totalSd)}</td>
                    <td className="text-right">
                      {_fixedPoint(item?.totalVat)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(item?.rebateTotal)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(item?.grandTotal)}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td className="text-right" colspan="11">
                  <b>Total</b>
                </td>
                <td className="text-right">
                  <b>{_fixedPoint(totalQty)}</b>
                </td>
                <td className="text-right">
                  <b>{_fixedPoint(totalPurchase)}</b>
                </td>
                <td className="text-right">
                  <b>{_fixedPoint(totalSd)}</b>
                </td>
                <td className="text-right">
                  <b>{_fixedPoint(totalVat)}</b>
                </td>
                <td className="text-right">
                  <b>{_fixedPoint(rebateTotal)}</b>
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

export default LocalPurchaseTable;
