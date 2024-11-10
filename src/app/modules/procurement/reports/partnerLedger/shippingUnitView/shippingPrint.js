import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Axios from "axios";
import ICard from "../../../../_helper/_card";
import ICustomTable from "../../../../_helper/_customTable";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

const ths = [
  "Customer Name",
  "Address",
  "Delivery No",
  "Item Code",
  "Product Name",
  "Rate",
  "Qty",
  "Amount",
];

export default function ShippingPrint({ id ,shipmentCode}) {
  const printRef = useRef();
  const [shippingPrint, setSingleShippingPrintInfo] = useState("");
  let storeData = useSelector(
    (state) => {
      return {
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
      };
    },
    { shallowEqual }
  );
  let { selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (id) {
      getDeliveryShippingPrintInfoById(id);
    }
  }, [id]);

  const getDeliveryShippingPrintInfoById = async (id) => {
    try {
      const res = await Axios.get(
        `/wms/Delivery/GetDeliveryPrintInfo?ShipmentId=${id}`
      );
      console.log(res);
      if (res && res.data) {
        setSingleShippingPrintInfo(res.data);
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
              <b className="display-5"> DELIVERY NOTE </b> <br />
              <b className="display-5"> {selectedBusinessUnit?.label} </b>
            </div>
            <div className="d-flex justify-content-between my-5">
              <div>
                <b>Delivery From: Dhamrai Food Factory </b> <br />
                <b>Shipment No: {`${shipmentCode}`} </b> <br />
              </div>
              <div>
                <b>Delivery Date: {_dateFormatter(new Date())} </b> <br />
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <b>Unload Vehicle Weight: {`${shippingPrint.unloadVehicleWeight}`} </b> <br />
              </div>
              <div>
                <b>Item Net weight: {`${shippingPrint.totalNetWeight}`} </b> <br />
              </div>
              <div>
                <b>Item Volume: {`${shippingPrint.totalVolume}`} </b> <br />
              </div>
              <div>
                <b>Total Net Weight: {`${shippingPrint.totalNetWeight}`} </b> <br />
              </div>
            </div>
            <div className=" my-5">
              <ICustomTable ths={ths}>
                <tr>
                  <td className="text-center">
                    {" "}
                    {shippingPrint.customerName}{" "}
                  </td>
                  <td className="text-center">
                    {" "}
                    {shippingPrint.customerAddress}
                  </td>
                  <td className="text-center"> {shippingPrint.deliveryId}</td>
                  <td className="text-center"> {shippingPrint.itemCode}</td>
                  <td className="text-center">{shippingPrint.itemName}</td>
                  <td className="text-center">{shippingPrint.itemPrice}</td>
                  <td className="text-center">{shippingPrint.quantity}</td>
                  <td className="text-center">{shippingPrint.deliveryValue}</td>
                </tr>
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
