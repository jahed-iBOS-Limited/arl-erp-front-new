import React from "react";
import { _dateFormatterTwo } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

export default function FullChallanTable({ obj }) {
  const { gridData } = obj;

  let totalDeliveryQty = 0;
  let totalAmount = 0;
  let totalDamage = 0;
  return (
    <>
      {gridData?.length > 0 && (
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Challan No</th>
              <th>Unit Name</th>
              <th>Sales JV ID</th>
              <th>Order No</th>
              <th>Order Qty</th>
              <th>Item Name</th>
              <th>Delivery Qty</th>
              <th>Product Price</th>
              <th>Delivery Amount</th>
              <th style={{ width: "120px" }}>Damage Qty</th>
              <th>Challan Date</th>
            </tr>
          </thead>
          <tbody>
            {gridData?.map((item, index) => {
              totalDeliveryQty += item?.numDeliveryQnt;
              totalAmount += item?.numDeliveryAmount;
              totalDamage += item?.numDeliveryQnt;

              return (
                <tr key={index}>
                  <td> {index + 1}</td>
                  <td> {item?.strchallan}</td>
                  <td> {item?.strunint}</td>
                  <td> {item?.intsalesjvid}</td>
                  <td> {item?.stroder}</td>
                  <td className="text-right"> {item?.orderqnt}</td>
                  <td> {item?.strItemName}</td>
                  <td className="text-right"> {item?.numDeliveryQnt}</td>
                  <td className="text-right"> {item?.numProductPrice}</td>
                  <td className="text-right">{item?.numDeliveryAmount}</td>
                  <td className="text-right">{item?.numDeliveryQnt}</td>
                  <td> {_dateFormatterTwo(item?.dteChallanDate)}</td>
                </tr>
              );
            })}
            <tr style={{ textAlign: "right", fontWeight: "bold" }}>
              <td colSpan={7} className="text-right">
                <b>Total</b>
              </td>
              <td>{_fixedPoint(totalDeliveryQty, true, 0)}</td>
              <td></td>
              <td>{_fixedPoint(totalAmount, true, 0)}</td>
              <td>{_fixedPoint(totalDamage, true, 0)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
}
