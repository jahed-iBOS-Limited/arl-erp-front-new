import React from "react";
import { _dateFormatter } from "../../../_helper/_dateFormate";

const TablePortion = ({ landingData }) => {
  const data = Array.isArray(landingData) ? landingData : [];

  return (
    <div className="mt-2">
      <div className="table-responsive">
        <table className="table table-striped table-bordered inv-table">
          <thead>
            <tr>
              <th className="text-center align-middle">SL</th>
              <th className="text-left align-middle"> Purchase OrderDate</th>
              <th className="text-center align-middle">Purchase ReceiveDate </th>
              <th className="text-center align-middle">Delivery date </th>
              <th className="text-center align-middle">Purchase Code</th>
              <th className="text-center align-middle">Purchase Receive </th>
              <th className="text-center align-middle">Delivery Code</th>
              <th className="text-center align-middle">Customer Name</th>
              <th className="text-center align-middle">Item Code</th>
              <th className="text-left align-middle">Item Name</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, i) => (
              <tr key={i}>
                <td className="text-center align-middle"> {i + 1} </td>
                <td className="text-center align-middle"> {_dateFormatter(item?.purchaseOrderDate)}</td>
                <td className="text-center align-middle"> {_dateFormatter(item?.purchaseReceiveDate)}</td>
                <td className="text-center align-middle"> {_dateFormatter(item?.deliverydate)}</td>
                <td className="text-center align-middle"> {item?.purchaseOrderCode} </td>
                <td className="text-center align-middle"> {item?.purchaseReceiveCode} </td>
                <td className="text-center align-middle"> {item?.deliveryCode}</td>
                <td className="text-center align-middle"> {item?.customerName || ""}</td>
                <td className="">{item?.itmeCode}</td>
                <td className="">{item?.itemName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablePortion;
