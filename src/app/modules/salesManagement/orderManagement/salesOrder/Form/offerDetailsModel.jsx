import React from "react";

function OfferDetailsModel({ tradeOffersList }) {
  return (
    <div>
      <div className="table-responsive">
        <table className={"table global-table"}>
          <thead>
            <tr>
              <th style={{ width: "20px" }}>SL</th>
              <th style={{ width: "120px" }}>Item Name </th>
              <th>Order Qty </th>
              <th>Offer Item Name </th>
              <th>Offer Qty </th>
              <th>Offer Ratio </th>
            </tr>
          </thead>
          <tbody>
            {tradeOffersList?.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item?.itemName}</td>
                <td>{item?.orderQty}</td>
                <td>{item?.offerItemName}</td>
                {/* <td>{item?.offerQty}</td> */}
                <td>{item?.offerQtyBySloat}</td>
                <td>{item?.offerRatio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OfferDetailsModel;
