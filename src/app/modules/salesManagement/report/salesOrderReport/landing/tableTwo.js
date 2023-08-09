import React from "react";
import ICustomTable from "../../../../_helper/_customTable";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

const ths = [
  "SL",
  "SO Code",
  "Ship To Party",
  "Item Code",
  "Item Name",
  "Is Free",
  "Quantity",
  "Basic Price",
  "Amount",
  "Net Value",
];

export default function TableTwo({ obj }) {
  const { rowData } = obj;

  let totalQty = 0,
    totalAmount = 0;
  return (
    <>
      <ICustomTable ths={ths}>
        {rowData?.map((item, i) => {
          totalQty += item?.numOrderQuantity;
          totalAmount += item?.salesorderAmount;
          return (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{item?.strSalesOrderCode}</td>
              <td>{item?.strShipToPartnerName}</td>
              <td>{item?.strItemCode}</td>
              <td>{item?.strItemName}</td>
              <td>{item?.isFreeItem ? "Yes" : "No"}</td>
              <td className="text-right">
                {_fixedPoint(item?.numOrderQuantity, true, 0)}
              </td>
              <td className="text-right">
                {_fixedPoint(item?.numItemPrice, true, 0)}
              </td>
              <td className="text-right">
                {_fixedPoint(item?.salesorderAmount, true, 0)}
              </td>
              <td className="text-right">
                {_fixedPoint(item?.salesorderAmount, true, 0)}
              </td>
            </tr>
          );
        })}
        <tr>
          <td className="text-right" colSpan={6}>
            <b>Total</b>
          </td>
          <td className="text-right">
            <b>{_fixedPoint(totalQty, true, 0)}</b>
          </td>
          <td></td>
          <td className="text-right">
            <b>{_fixedPoint(totalAmount, true, 0)}</b>
          </td>
          <td className="text-right">
            <b>{_fixedPoint(totalAmount, true, 0)}</b>
          </td>
        </tr>
      </ICustomTable>
    </>
  );
}
