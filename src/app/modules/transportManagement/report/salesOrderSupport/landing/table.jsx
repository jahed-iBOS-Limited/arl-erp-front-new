import React from "react";
import ICustomTable from "../../../../_helper/_customTable";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

const Table = ({ gridData }) => {
  const headers = [
    "SL",
    "Channel",
    "ShipPoint",
    "Party Name",
    "SO Code",
    "Item Name",
    "Order Qty",
    "Order Amount",
    "Delivery Qty",
    "UnDelivery Qty",
    "Challan Complete Qty",
    "Challan Incomplete Qty",
  ];

  return (
    <ICustomTable ths={headers}>
      {gridData?.map((item, index) => (
        <tr key={index + item?.sorstrSalesOrderCode} style={
          item?.numOrderQuantity<0 || item?.numdeliveryqnt < 0
            ? { backgroundColor: "#f8d7da" }
            : { backgroundColor: "#d4edda" }
        }>
          <td> {index + 1}</td>
          <td> {item?.strChannelNaem}</td>
          <td> {item?.strShippingPointName}</td>
          <td> {item?.sostrSoldToPartnerName}</td>
          <td> {item?.sorstrSalesOrderCode}</td>
          <td> {item?.strItemName}</td>
          <td className="text-right"> {item?.numOrderQuantity}</td>
          <td className="text-right">
            {_fixedPoint(item?.OrderAmount, true, 0)}
          </td>
          <td className="text-right"> {item?.numdeliveryqnt}</td>
          <td className="text-right"> {item?.numUndeliveryQuantity}</td>
          <td className="text-right"> {item?.numChallanCompleteQnt}</td>
          <td className="text-right"> {item?.numChallanInCompleteQnt}</td>
        </tr>
      ))}
    </ICustomTable>
  );
};

export default Table;
