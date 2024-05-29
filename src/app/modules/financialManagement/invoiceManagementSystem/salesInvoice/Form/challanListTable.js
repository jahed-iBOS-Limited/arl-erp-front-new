import React, { useState } from "react";
import IViewModal from "../../../../_helper/_viewModal";
import DeliveryReport from "./deliveryReport/table";

export const ChallanListTable = ({ obj }) => {
  const { challanList } = obj;
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  return (
    <>
      <div className="table-responsive">
        <table className="global-table table">
          <thead>
            <tr>
              <th style={{ width: "30px" }}>SL</th>
              <th>Challan No</th>
              <th>Challan Date</th>
              <th>Ship To Party</th>
              <th>ShipPoint</th>
              <th>Warehouse</th>
              <th>Contact Person</th>
              <th>Logistic by</th>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Driver Contact</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {challanList?.map((item, index) => {
              return (
                <tr className="cursor-pointer" key={index}>
                  <td>{index + 1}</td>
                  <td className="ml-2">
                    <span
                      style={{
                        borderBottom: "1px solid blue",
                        cursor: "pointer",
                        color: "blue",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShow(true);
                        setSelectedItem(item);
                      }}
                    >
                      {item?.challanNo}
                    </span>
                  </td>
                  <td>{item?.deliveryAt}</td>
                  <td>{item?.shipToPartner}</td>
                  <td>{item?.shippointName}</td>
                  <td>{item?.warehouseName}</td>
                  <td>{item?.contactPerson}</td>
                  <td>{item?.logistic}</td>
                  <td>{item?.vehicleNo}</td>
                  <td>{item?.driver}</td>
                  <td>{item?.driverContact}</td>
                  <td>{item?.address}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <IViewModal
        show={show}
        onHide={() => {
          setShow(false);
          setSelectedItem({});
        }}
      >
        <DeliveryReport id={selectedItem?.deliveryId} />
      </IViewModal>
    </>
  );
};
