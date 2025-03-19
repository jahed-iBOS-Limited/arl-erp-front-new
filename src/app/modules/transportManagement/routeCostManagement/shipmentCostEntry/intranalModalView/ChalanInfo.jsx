import React, { useEffect, useState } from "react";
import { getChalanInfo } from "./helper";

const ChalanInfo = ({ shipmentId }) => {
  const [chalanInfo, setChalanInfo] = useState([]);

  useEffect(() => {
    getChalanInfo(shipmentId, setChalanInfo);
  }, [shipmentId]);

  return (
    <>
      <div className="col-lg-6">
        <div className="mt-2">
          {" "}
          <h5 className="mt-1">Chalan Info</h5>
        </div>
        <div className="table-responsive">
        <table className={"table global-table"}>
          <thead>
            <tr>
              <th style={{ width: "20px" }}>SL</th>
              <th>Delivery Code</th>
              <th>Shipment Code</th>
              <th >Shipping Name</th>
              <th>Address</th>
              <th>Delivery Quantity</th>
            </tr>
          </thead>
          <tbody>
            {chalanInfo?.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item?.deliveryCode}</td>
                <td>{item?.shipmentCode}</td>
                <td>{item?.partnerShippingName}</td>
                <td>{item?.partnerShippingAddress}</td>
                <td className="text-center">{item?.totalDeliveryQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </>
  );
};

export default ChalanInfo;
