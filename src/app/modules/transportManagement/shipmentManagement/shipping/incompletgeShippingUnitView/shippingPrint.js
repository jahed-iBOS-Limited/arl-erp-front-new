import React, { useEffect, useState, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Axios from "axios";
import ICard from "../../../../_helper/_card";
import ICustomTable from "../../../../_helper/_customTable";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

const ths = [
  "Delivery Code",
  "Item Name",
  "Item Code",
  "Sales Name",
  "Sales Order Code",
  "UOM",
  // "Price",
  // "Net Value",
  "Qty",
];

export default function ShippingPrint({ id, shipmentCode }) {
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
        `/tms/Shipment/GetShipmentById?deliveryId=${id}`
      );
      if (res && res.data) {
        setSingleShippingPrintInfo(res?.data);
      }
    } catch (error) {
      console.log(error);
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
          <div className="mx-auto print_wrapper">
            <div>
              <div className="text-center my-2">
                <b className="display-5"> Shipping Note </b> <br />
                <b className="display-5"> {selectedBusinessUnit?.label} </b>
              </div>
              <div className="d-flex justify-content-between my-5">
                <div>
                  <b>Delivery From: Dhamrai Food Factory </b> <br />
                  <b>
                    Partner Name:{" "}
                    {`${shippingPrint?.objHeader?.strShipToPartnerName}`}{" "}
                  </b>{" "}
                  <br />
                  <b>
                    Warehouse Name:{" "}
                    {`${shippingPrint?.objHeader?.strWarehouseName}`}{" "}
                  </b>{" "}
                  <br />
                  <b>
                    Delivery Type Name:{" "}
                    {`${shippingPrint?.objHeader?.strDeliveryTypeName}`}{" "}
                  </b>{" "}
                  <br />
                  <b>
                    Total Net Value:{" "}
                    {`${shippingPrint?.objHeader?.numTotalNetValue}`}{" "}
                  </b>{" "}
                  <br />
                  <b>
                    Total Delivery Value:{" "}
                    {`${shippingPrint?.objHeader?.numTotalDeliveryValue}`}{" "}
                  </b>{" "}
                  <br />
                </div>

                <div>
                  <b>Delivery Date: {_dateFormatter(new Date())} </b> <br />
                  <b>
                    Plant Name: {`${shippingPrint?.objHeader?.strPlantName}`}{" "}
                  </b>{" "}
                  <br />
                  <b>
                    Warehouse Address:{" "}
                    {shippingPrint?.objHeader?.strWarehouseAddress}{" "}
                  </b>{" "}
                  <br />
                  <b>
                    Distribution Channel Name:{" "}
                    {shippingPrint?.objHeader?.strDistributionChannelName}{" "}
                  </b>{" "}
                  <br />
                  <b>
                    Total Delivery Quantity:{" "}
                    {shippingPrint?.objHeader?.numTotalDeliveryQuantity}{" "}
                  </b>{" "}
                  <br />
                </div>
              </div>

              <div className=" my-5">
                <ICustomTable ths={ths}>
                  {shippingPrint?.objRow?.map((itm) => (
                    <tr>
                      <td>
                        <div className="pl-2">{itm?.strDeliveryCode}</div>
                      </td>
                      <td>
                        <div className="pl-2">{itm?.strItemName}</div>
                      </td>
                      <td>
                        <div className="pl-2">{itm?.strItemCode}</div>
                      </td>
                      <td>
                        <div className="pl-2">{itm?.strItemSalesName}</div>
                      </td>
                      <td>
                        <div className="pl-2">{itm?.strSalesOrderCode}</div>
                      </td>
                      <td>
                        <div className="pl-2">{itm?.strUom}</div>
                      </td>
                      {/* <td>
                        <div className="text-right pr-2">
                          {itm?.numItemPrice}
                        </div>
                      </td>
                      <td>
                        <div className="text-right pr-2">
                          {itm?.numNetValue}
                        </div>
                      </td> */}
                      <td>
                        <div className="text-right pr-2">
                          {itm?.numQuantity}
                        </div>
                      </td>
                    </tr>
                  ))}
                </ICustomTable>
              </div>
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
