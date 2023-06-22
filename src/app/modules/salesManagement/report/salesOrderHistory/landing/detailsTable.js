import React from "react";

export default function CommonTable({ salesOrderData, printRef }) {
  return (
    <>
      <div className="table-responsive">
        <table
          ref={printRef}
          className="table table-striped table-bordered global-table table-font-size-sm"
        >
          <thead>
            <tr>
              <th style={{ width: "30px" }}>SL</th>
              <th style={{ width: "100px" }}>Sold to Partner</th>
              <th style={{ width: "100px" }}>Channel Name</th>
              <th style={{ width: "100px" }}>Shippoint Name</th>
              <th style={{ width: "120px" }}>Sales Order Code</th>
              <th style={{ width: "120px" }}>Request Quantity</th>
              <th style={{ width: "120px" }}>Order Quantity</th>
              <th style={{ width: "120px" }}>Delivery Quantity</th>
              <th style={{ width: "120px" }}>Un Delivery Quantity</th>
              <th style={{ width: "120px" }}>Actual Delivery Quantity</th>
              <th style={{ width: "120px" }}>Actual Un Delivery Quantity</th>
              <th style={{ width: "120px" }}>Actual Un Delivery Amount</th>
            </tr>
          </thead>

          <tbody>
            {salesOrderData?.map((item, index) => (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td>{item?.strsoldtopartner}</td>
                <td className="text-center">{item?.strChannelName}</td>
                <td className="text-center">{item?.strshippointname}</td>
                <td>{item?.strsalesordercode}</td>
                <td className="text-center">{item?.numrequestquantity}</td>
                <td>{item?.numorderquantity}</td>
                <td className="text-center">{item?.numDeliveredQuantity}</td>
                <td>{item?.numUndeliveryQuantity}</td>
                <td className="text-center">
                  {item?.numActualDeliveredQuantity}
                </td>
                <td className="text-center">
                  {item?.numActualUndeliveryQuantity}
                </td>
                <td className="text-center">{item?.actualUndelvAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
