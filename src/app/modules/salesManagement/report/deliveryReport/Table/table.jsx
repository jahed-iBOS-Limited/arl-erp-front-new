import React, { useEffect, useState, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ICard from "../../../../_helper/_card";
import ICustomTable from "../../../../_helper/_customTable";
import Axios from "axios";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

const ths = ["Sl", "Item Code", "Product Name", "UOM", "Rate", "Qty", "Amount"];

export default function DeliveryReportTable() {
  const printRef = useRef();
  let storeData = useSelector(
    (state) => {
      return {
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
      };
    },
    { shallowEqual }
  );
  let { selectedBusinessUnit } = storeData;
  const [rowDto, setRowDto] = useState([]);
  const [deliveryOrderReportHeader, setDeliveryOrderReporHeader] = useState([]);

  useEffect(() => {
    getDeliveryChallanInfoById();
  }, []);

  const getDeliveryChallanInfoById = async () => {
    try {
      const res = await Axios.get(
        `/wms/Delivery/GetDeliveryChallanInfo?DeliveryOrderId=1`
      );
      if (res && res.data.length) {
        setDeliveryOrderReporHeader(res.data[0].objHeader);
        setRowDto([...res.data[0].objRow]);
      }
    } catch (error) {
     
    }
  };

  return (
    <>
      <ICard
        printTitle="Print"
        title=""
        isPrint={true}
        isShowPrintBtn={true}
        componentRef={printRef}
      >
        <div ref={printRef}>
          <div className="mx-auto">
            <div className="text-center my-2">
              <b className="display-5"> DELIVERY CHALLAN </b> <br />
              <b className="display-5"> {selectedBusinessUnit?.label} </b>
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <b>Customer Name : {deliveryOrderReportHeader?.customerName}</b>{" "}
                <br />
                <b>
                  Shiping Address : {deliveryOrderReportHeader?.shippingAddress}{" "}
                </b>{" "}
                <br />
                <b>
                  Customer Phone No :{" "}
                  {deliveryOrderReportHeader?.customerContactNo}{" "}
                </b>
              </div>
              <div>
                <b>Delivery From : {deliveryOrderReportHeader?.deliveryFrom}</b>{" "}
                <br />
                <b>
                  Delivery No: {deliveryOrderReportHeader?.deliveryCode}{" "}
                </b>{" "}
                <br />
                <b>
                  Delivery Date:
                  {_dateFormatter(deliveryOrderReportHeader?.deliveryDate)}{" "}
                </b>
              </div>
            </div>
            <div className="d-flex justify-content-between my-5">
              <div>
                <b>Vehicle No: {deliveryOrderReportHeader?.vehicleId}, </b>
                <b>Driver: {deliveryOrderReportHeader?.driverName}, </b>
                <b>(Cell: {deliveryOrderReportHeader?.driverContact}) </b>
              </div>
              <div>
                <b>
                  Total Amount:
                  {rowDto.reduce((sum, current) => {
                    return sum + current.totalShipingValue;
                  }, 0)}
                  ,
                </b>
              </div>
            </div>
            <div className=" my-5">
              <ICustomTable ths={ths}>
                {rowDto.map((itm, i) => {
                  return (
                    <tr key={i}>
                      <td className="text-center"> {i + 1}</td>
                      <td className="text-center"> {itm.itemCode}</td>
                      <td className="text-center" style={{ width: "50%" }}>
                        {" "}
                        {itm.itemName}
                      </td>
                      <td className="text-center"> {itm.uom}</td>
                      <td className="text-center">{itm.itemPrice}</td>
                      <td className="text-center">{itm.quantity}</td>
                      <td className="text-center">{itm.deliveryValue}</td>
                    </tr>
                  );
                })}
              </ICustomTable>
            </div>
            <div
              className="d-flex justify-content-between"
              style={{ margin: "80px 0 0" }}
            >
              <div>
                <b style={{ borderTop: "1px solid", padding: "5px 0 0" }}>
                  Authority Signature
                </b>
              </div>
              <div>
                <b style={{ borderTop: "1px solid", padding: "5px 0 0" }}>
                  Driver Signature
                </b>
              </div>
              <div>
                <b style={{ borderTop: "1px solid", padding: "5px 0 0" }}>
                  Customer Signature
                </b>
              </div>
            </div>
          </div>
        </div>
      </ICard>
    </>
  );
}
