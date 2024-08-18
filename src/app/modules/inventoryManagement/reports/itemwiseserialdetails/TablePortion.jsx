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
              <th className="text-center align-middle">Serial Number</th>
              <th className="text-center align-middle">Item Code</th>
              <th className="text-left align-middle" style={{width:"220px"}}>Item Name</th>
              <th className="text-left align-middle"> Purchase Order Date</th>
              <th className="text-center align-middle">Purchase Order Code </th>
              <th className="text-center align-middle">Purchase Receive Date</th>
              <th className="text-center align-middle">Purchase Receive Code</th>
              <th className="text-center align-middle">Delivery date </th>
              <th className="text-center align-middle">Delivery Code</th>
              <th className="text-center align-middle">Customer Name</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, i) => (
              <tr key={i}>
                <td className="text-center align-middle"> {i + 1} </td>
                <td className="text-center align-middle"> {item?.serialNumber || "N/A"}</td>
                <td className="">{item?.itmeCode || "N/A"}</td>
                <td className="">{item?.itemName || "N/A"}</td>
                <td className="text-center align-middle"> {_dateFormatter(item?.purchaseOrderDate) || "N/A"}</td>
                <td className="text-center align-middle"> {item?.purchaseOrderCode || "N/A"} </td>
                <td className="text-center align-middle"> {_dateFormatter(item?.purchaseReceiveDate) || "N/A"}</td>
                <td className="text-center align-middle"> {item?.purchaseReceiveCode || "N/A"} </td>
                <td className="text-center align-middle"> {_dateFormatter(item?.deliverydate) || "N/A"}</td>
                <td className="text-center align-middle"> {item?.deliveryCode || "N/A"}</td>
                <td className="text-center align-middle"> {item?.customerName || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablePortion;
