import React from "react";
import "./index.css";

export default function OutsideGovSubsidyTable({ rowData }) {
  let purchaseTotalQty = rowData?.left?.reduce(
    (acc, obj) => acc + obj?.totalQty,
    0
  );
  let purchaseRate =
    rowData?.left?.reduce((acc, obj) => acc + obj?.price, 0) /
      rowData?.left?.length || 0;
  let purchaseTotalAmount = rowData?.left?.reduce(
    (acc, obj) => acc + obj?.totalAmount,
    0
  );

  let sellTotalQty = rowData?.right?.reduce(
    (acc, obj) => acc + obj?.totalQty,
    0
  );
  let sellRate =
    rowData?.right?.reduce((acc, obj) => acc + obj?.itemPrice, 0) /
      rowData?.right?.length || 0;
  let sellTotalAmount = rowData?.right?.reduce(
    (acc, obj) => acc + obj?.amount,
    0
  );

  return (
    <div>
      <h6 className="mb-0 mt-3">
        Report of Fertilizers Managed Outside Govt. Subsidy
      </h6>
      <div className="table-responsive print-height-none">
        <table
          id="table-to-xlsx"
          className="table-header-sticky table table-striped table-bordered global-table table-font-size-sm print-height-none"
        >
          <thead>
            <tr>
              <th style={{ width: "30px" }} rowSpan="1" colSpan="5">
                Purchase
              </th>
              <th style={{ width: "100px" }} rowSpan="1" colSpan="4">
                Re-sell
              </th>
            </tr>

            <tr>
              <th colSpan="1" rowSpan="1">
                Customer Name
              </th>
              <th colSpan="1" rowSpan="1">
                Commission Agent Name
              </th>
              <th colSpan="1" rowSpan="1">
                Quantity Bought (MT)
              </th>
              <th colSpan="1" rowSpan="1">
                Rate (per MT)
              </th>
              <th colSpan="1" rowSpan="1">
                Total Amount (BDT)
              </th>

              <th colSpan="1" rowSpan="1">
                Customer Name
              </th>
              <th colSpan="1" rowSpan="1">
                Quantity Sold (MT)
              </th>
              <th colSpan="1" rowSpan="1">
                Rate (per MT)
              </th>
              <th colSpan="1" rowSpan="1">
                Total Amount (BDT)
              </th>

              {/* <th colSpan="1" rowSpan="1">
                Residual Quantity (MT)
              </th>
              <th colSpan="1" rowSpan="1">
                Avg. Rate (per MT)
              </th> */}
            </tr>
          </thead>

          <tbody>
            {[
              ...Array(
                Math.max(
                  rowData?.left?.length || 0,
                  rowData?.right?.length || 0
                )
              ),
            ]?.map((_, key) => (
              <tr key={key}>
                {rowData?.left[key] ? (
                  <>
                    <td className="text-left">
                      {rowData?.left[key].strBusinessPartnerName}
                    </td>
                    <td className="text-left">
                      {rowData?.left[key].strAccOfParnterName}
                    </td>
                    <td className="text-right">
                      {rowData?.left[key].totalQty}
                    </td>
                    <td className="text-right">{rowData?.left[key].price}</td>
                    <td className="text-right">
                      {rowData?.left[key].totalAmount}
                    </td>
                  </>
                ) : (
                  <>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </>
                )}

                {rowData?.right[key] ? (
                  <>
                    <td className="text-left">
                      {rowData?.right[key].businessPartnerName}
                    </td>
                    <td className="text-right">
                      {rowData?.right[key].totalQty}
                    </td>
                    <td className="text-right">
                      {rowData?.right[key].itemPrice}
                    </td>
                    <td className="text-right">{rowData?.right[key].amount}</td>
                  </>
                ) : (
                  <>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </>
                )}
              </tr>
            ))}

            <tr>
              <td className="text-right" colSpan="2">
                Total
              </td>
              <td className="text-right">
                {purchaseTotalQty?.toFixed(2) || 0}
              </td>
              <td className="text-right">{purchaseRate?.toFixed(2) || 0}</td>
              <td className="text-right">
                {purchaseTotalAmount?.toFixed(2) || 0}
              </td>

              <td className="text-right">Total</td>

              <td className="text-right">{sellTotalQty?.toFixed(2) || 0}</td>
              <td className="text-right">{sellRate?.toFixed(2) || 0}</td>
              <td className="text-right">{sellTotalAmount?.toFixed(2) || 0}</td>
            </tr>

            <tr>
              <td className="text-left" colSpan="10">
                Residual Quantity (MT) :{" "}
                <strong>
                  {(purchaseTotalQty - sellTotalQty)?.toFixed(2) || 0}
                </strong>
              </td>
            </tr>
            <tr>
              <td className="text-left" colSpan="10">
                Avg. Rate (per MT) :{" "}
                <strong>{(purchaseRate - sellRate)?.toFixed(2) || 0}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
