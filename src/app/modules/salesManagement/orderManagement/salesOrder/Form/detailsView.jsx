import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

const DetailsView = ({ gridData, tableType }) => {
  // Totals for order table
  let totalUnDeliveredQty = 0;
  let totalUnDeliveredAmount = 0;

  // Totals for delivery table
  let totalQty = 0;

  // Totals for unBilled table
  let totalQuantity = 0;
  let totalPendingAmount = 0;

  return (
    <>
      {tableType === "order" ? (
        <div className="table-responsive">
          <table className="table table-striped table-bordered global-table sales_order_landing_table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Order Code</th>
                <th>Order Date</th>
                <th>Ship Point Name</th>
                <th>Undelivered Qty</th>
                <th>Undelivered Amount</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.map((td, index) => {
                totalUnDeliveredQty += td?.undeliverQuantity;
                totalUnDeliveredAmount += td?.undeliverAmount;

                return (
                  <tr key={index}>
                    <td> {index + 1} </td>
                    <td> {td?.orderCode} </td>
                    <td> {_dateFormatter(td?.orderDate)} </td>
                    <td> {td?.shippointName} </td>
                    <td className="text-right">
                      {_fixedPoint(td?.undeliverQuantity, true, 0)}{" "}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(td?.undeliverAmount, true)}{" "}
                    </td>
                  </tr>
                );
              })}
              <tr style={{ fontWeight: "bold", textAlign: "right" }}>
                <td className="text-right" colSpan={4}>
                  Total
                </td>
                <td>{_fixedPoint(totalUnDeliveredQty, true)}</td>
                <td>{_fixedPoint(totalUnDeliveredAmount, true)}</td>
              </tr>
            </tbody>
          </table>{" "}
        </div>
      ) : tableType === "delivery" ? (
        <div className="table-responsive">
          <table className="table table-striped table-bordered global-table sales_order_landing_table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Challan No</th>
                <th>Ship Point Name</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.map((td, index) => {
                totalQty += td?.quantity;
                return (
                  <tr key={index}>
                    <td> {index + 1} </td>
                    <td> {td?.challanNo} </td>
                    <td> {td?.shippointName} </td>
                    <td className="text-right"> {td?.quantity} </td>
                  </tr>
                );
              })}
              <tr style={{ fontWeight: "bold", textAlign: "right" }}>
                <td className="text-right" colSpan={3}>
                  Total
                </td>
                <td>{_fixedPoint(totalQty, true)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered global-table sales_order_landing_table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Code</th>
                <th>Ship Point Name</th>
                <th>Quantity</th>
                <th>Pending Amount</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.map((td, index) => {
                totalQuantity += td?.numQuantity;
                totalPendingAmount += td?.PendingAmount;
                return (
                  <tr key={index}>
                    <td> {index + 1} </td>
                    <td> {td?.strCode} </td>
                    <td> {td?.strShipPointName} </td>
                    <td className="text-right"> {td?.numQuantity} </td>
                    <td className="text-right"> {td?.PendingAmount} </td>
                  </tr>
                );
              })}
              <tr style={{ fontWeight: "bold", textAlign: "right" }}>
                <td className="text-right" colSpan={3}>
                  Total
                </td>
                <td>{_fixedPoint(totalQuantity, true)}</td>
                <td>{_fixedPoint(totalPendingAmount, true)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default DetailsView;
