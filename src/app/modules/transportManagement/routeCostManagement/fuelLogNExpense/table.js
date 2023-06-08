import React from "react";
import ICustomTable from "../../../_helper/_customTable";

export default function Table({ gridData }) {
  const headers = [
    "SL",
    "Employee Name",
    "Fuel Station",
    "Fuel Type",
    "Quantity",
    "Payment Method",
    "Cash Amount",
    "Credit Amount",
  ];
  let totalCashAmount = 0,
    totalCreditAmount = 0;
  return (
    <>
      <ICustomTable id="table-to-xlsx" ths={headers}>
        {gridData.map((item, index) => {
          totalCashAmount += item?.numCashAmount || 0;
          totalCreditAmount += item?.numCreditAmount || 0;
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item?.strEmployeeFullName}</td>
              <td>{item?.strFuelStationName}</td>
              <td>{item?.strFuelTypeName}</td>
              <td>{item?.numQuantity}</td>
              <td>{item?.strPaymentMethod}</td>
              <td className="text-right">{item?.numCashAmount}</td>
              <td className="text-right">{item?.numCreditAmount}</td>
            </tr>
          );
        })}
        <tr>
          <td className="text-right" colSpan={6}>
            <b>Total</b>
          </td>
          <td className="text-right">
            <b>{totalCashAmount}</b>
          </td>
          <td className="text-right">
            <b>{totalCreditAmount}</b>
          </td>
        </tr>
      </ICustomTable>
    </>
  );
}
