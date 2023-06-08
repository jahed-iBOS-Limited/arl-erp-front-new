import React from "react";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import "./style.css";
function ImportPurchaseTable({ rowDto }) {
  let totalQty = 0,
    totalVat = 0,
    totalSd = 0,
    grandTotal = 0,
    totalCD = 0,
    totalRD = 0,
    totalAIT = 0,
    totalAT = 0,
    totalPurchase = 0,
    rebateTotal = 0;

  return (
    <div className="ImportPurchaseTable">
      <div className="loan-scrollable-table">
        <div
          style={{ maxHeight: "400px" }}
          className="scroll-table _table scroll-table-auto"
        >
          <table
            className="table table-striped table-bordered global-table"
            id="table-to-xlsx"
          >
            <thead>
              <tr>
                <th>SL </th>
                <th>Purchase Date </th>
                <th>Purchase Code </th>
                <th>BOE No </th>
                <th>BOE Date </th>
                <th>LC No. </th>
                <th>LC Date </th>
                <th>Port Name </th>
                <th>Branch Name </th>
                <th>Supply Type </th>
                <th>Trade Type </th>
                <th style={{ minWidth: "120px" }}>Customs House</th>
                <th>Customs Code</th>
                <th style={{ minWidth: "120px" }}>Supplier Name </th>
                <th style={{ minWidth: "220px" }}>Supplier Address</th>
                <th>HS Code </th>
                <th>Country Name </th>
                <th>Total Quantity </th>
                <th>Total Amount </th>
                <th>Total CD </th>
                <th>Total RD </th>
                <th>Total SD </th>
                <th>Total VAT </th>
                <th>Total AIT </th>
                <th>Total AT </th>
                <th>Total Rebate</th>
                <th>Grand Total </th>
              </tr>
            </thead>
            {rowDto?.length > 0 && (
              <>
                <tbody>
                  {rowDto?.map((item, index) => {
                    totalQty += +item?.totalQty || 0;
                    totalPurchase += +item?.totalPurchase || 0;
                    totalCD += +item?.totalCD || 0;
                    totalRD += +item?.totalRD || 0;
                    totalSd += +item?.totalSd || 0;
                    totalVat += +item?.totalVat || 0;
                    totalAIT += +item?.totalAIT || 0;
                    totalAT += +item?.totalAT || 0;
                    rebateTotal += +item?.rebateTotal || 0;
                    grandTotal += +item?.grandTotal || 0;
                    return (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{item?.taxPurchaseCode}</td>
                        <td>{_dateFormatter(item?.purchaseDate)}</td>
                        <td>{item?.referanceNo}</td>
                        <td>{_dateFormatter(item?.referanceDate)}</td>
                        <td>{item?.lcNo}</td>
                        <td>{_dateFormatter(item?.lcDate)}</td>
                        <td>{item?.strPortName}</td>
                        <td>{item?.taxBranchName}</td>
                        <td>{item?.supplyType}</td>
                        <td>{item?.tradeType}</td>
                        <td>{item?.customerName}</td>
                        <td>{item?.customHouseCode}</td>
                        <td>{item?.supplierName}</td>
                        <td style={{ fontSize: "11px" }}>
                          {item?.supplierAddress}
                        </td>
                        <td>{item?.hsCode}</td>
                        <td>{item?.orginCountryName}</td>
                        <td className="text-right">
                          {_fixedPoint(item?.totalQty)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.totalPurchase)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.totalCD)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.totalRD)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.totalSd)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.totalVat)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.totalAIT)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.totalAT)}
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
                </tbody>
                <tfoot>
                  <tr>
                    <td className="text-right" colspan="17">
                      Total
                    </td>
                    <td className="text-right font-weight-bold">
                      {_fixedPoint(totalQty)}
                    </td>
                    <td className="text-right font-weight-bold">
                      {_fixedPoint(totalPurchase)}
                    </td>
                    <td className="text-right font-weight-bold">
                      {_fixedPoint(totalCD)}
                    </td>
                    <td className="text-right font-weight-bold">
                      {_fixedPoint(totalRD)}
                    </td>
                    <td className="text-right font-weight-bold">
                      {_fixedPoint(totalSd)}
                    </td>
                    <td className="text-right font-weight-bold">
                      {_fixedPoint(totalVat)}
                    </td>
                    <td className="text-right font-weight-bold">
                      {_fixedPoint(totalAIT)}
                    </td>
                    <td className="text-right font-weight-bold">
                      {_fixedPoint(totalAT)}
                    </td>
                    <td className="text-right font-weight-bold">
                      {_fixedPoint(rebateTotal)}
                    </td>
                    <td className="text-right font-weight-bold">
                      {_fixedPoint(grandTotal)}
                    </td>
                  </tr>
                </tfoot>
              </>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

export default ImportPurchaseTable;
