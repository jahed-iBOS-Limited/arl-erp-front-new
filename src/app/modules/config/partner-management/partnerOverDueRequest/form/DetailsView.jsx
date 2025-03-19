import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

const DetailsView = ({ gridData, tableType }) => {
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
            {gridData?.map((td, index) => (
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
            ))}
            <tr style={{ fontWeight: "bold", textAlign: "right" }}>
              <td className="text-right" colSpan={4}>
                Total
              </td>
              <td>
                {_fixedPoint(
                  gridData?.reduce((acc, curr) => {
                    return acc + curr?.undeliverQuantity;
                  }, 0),
                  true,
                  0
                )}
              </td>
              <td>
                {_fixedPoint(
                  gridData?.reduce((acc, curr) => {
                    return acc + curr?.undeliverAmount;
                  }, 0),
                  true
                )}
              </td>
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
              <th>Challan No</th>
              <th>Ship Point Name</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {gridData?.map((td, index) => (
              <tr key={index}>
                <td> {index + 1} </td>
                <td> {td?.challanNo} </td>
                <td> {td?.shippointName} </td>
                <td className="text-right"> {td?.quantity} </td>
              </tr>
            ))}
            <tr style={{ fontWeight: "bold", textAlign: "right" }}>
              <td className="text-right" colSpan={3}>
                Total
              </td>
              <td>
                {_fixedPoint(
                  gridData?.reduce((acc, curr) => {
                    return acc + curr?.quantity;
                  }, 0),
                  true,
                  0
                )}
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      )}
    </>
  );
};

export default DetailsView;
