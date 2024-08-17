import Axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import QRCode from "qrcode.react";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import ICard from "../../../_helper/_card";
import Loading from "../../../_helper/_loading";
import { _dateFormatterTwo } from "../../../_helper/_dateFormate";
import ICustomTable from "../../../_helper/_customTable";
import { toast } from "react-toastify";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";

export default function ShippingInfoDetails({ obj }) {
  const { id, shipmentCode, setOpen, getData, values } = obj;
  const [loading, setLoading] = useState(false);
  const printRef = useRef();
  const [shippingPrint, setSingleShippingPrintInfo] = useState("");
  const [transportStatus, getTransportStatus] = useAxiosGet();
  const [, onComplete, loader] = useAxiosPost();

  const {
    profileData: { userId },
    selectedBusinessUnit: { value: buId, label: buName },
  } = useSelector((state) => state?.authData, {
    shallowEqual,
  });

  useEffect(() => {
    if (id) {
      getDeliveryShippingPrintInfoById(id);
      getTransportStatus(
        `/oms/SalesInformation/sprTransportStatusByDeliveryId?intParid=${2}&intBusinessUnitId=${buId}&PKID=${id}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, buId]);

  const getDeliveryShippingPrintInfoById = async (id) => {
    try {
      setLoading(true);
      const res = await Axios.get(
        `/wms/Delivery/GetDeliveryPrintInfo?ShipmentId=${id}`
      );
      if (res && res.data) {
        setSingleShippingPrintInfo(res.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  let totalQuantity = 0;
  let totalItemPrice = 0;
  let totalAmount = 0;

  const ths = [
    "Ship To Party",
    "Address",
    "Challan No",
    "Sales Order No",
    "Item Code",
    "Product Name",
    "UoM Name",
    "Qty",
    [144].includes(buId) && "Rate",
    [144].includes(buId) && "Amount",
  ];
  return (
    <>
      <ICard
        // printTitle="Print"
        title="Shipment Details"
        // isPrint={true}
        // isShowPrintBtn={true}
        // componentRef={printRef}
        // pageStyle={
        //   "@media print{body { -webkit-print-color-adjust: exact;padding: 0 50px!important; }@page {size: portrait ! important}}"
        // }
        isCreteBtn={true}
        createBtnText={"Done"}
        createHandler={() => {
          if (buId !== 4) {
            return toast.warn("Only Business Unit Cement is Permitted !!!");
          }

          onComplete(
            `/oms/LoadingPoint/CompletePacker?shipmentId=${id}&actionBy=${userId}&typeId=2`,
            null,
            () => {
              getData(values);
              setOpen(false);
            },
            true
          );
        }}
      >
        <div ref={printRef}>
          <div
            className="mx-auto print_wrapper-shipping"
            style={{ color: "#000" }}
          >
            {(loading || loader) && <Loading />}
            <div>
              <div style={{ display: "flex" }}>
                <div style={{ width: "15%" }}></div>
                <div style={{ width: "70%" }}>
                  <div className="text-center my-2">
                    <h3> Shipping Note </h3>
                    <h4 className="display-5"> {buName} </h4>
                    <h6 className="display-5">
                      {" "}
                      {shippingPrint?.objHeader?.shipPointAddress}{" "}
                    </h6>
                  </div>
                </div>
                <div style={{ width: "15%", paddingTop: "20px" }}>
                  {buId === 4 && (
                    <QRCode
                      data-qr={"Shipment Code"}
                      value={id || ""}
                      size={120}
                    />
                  )}
                </div>
              </div>

              <div className="d-flex justify-content-between my-5">
                <div>
                  <b>
                    Delivery From:{" "}
                    {`${shippingPrint?.objHeader?.shipPointName || ""}`}
                  </b>

                  <br />
                  <b>Shipment No: {`${shipmentCode}`}</b>

                  <br />
                  <b>
                    Driver Name: {`${shippingPrint?.objHeader?.driverName}`}
                  </b>

                  <br />
                  <b>
                    Driver Contact:{" "}
                    {`${shippingPrint?.objHeader?.driverContact}`}
                  </b>

                  <br />
                  {/* <b>
                    Item Volume: {`${shippingPrint?.objHeader?.totalVolume}`}
                  </b> */}
                  <b>
                    Product Gross Weight:{" "}
                    {`${shippingPrint?.objHeader?.totalGrossWeight}`}
                  </b>

                  <br />
                  <b>
                    Partner Reference:{" "}
                    {`${shippingPrint?.objHeader?.soReferenceNo || ""}`}
                  </b>

                  <br />
                  <b>
                    Pricing Date:{" "}
                    {`${_dateFormatterTwo(
                      shippingPrint?.objHeader?.pricingDate
                    ) || ""}`}
                  </b>

                  <br />
                  {(buId === 171 || buId === 224) && (
                    <b>Narration: {`${transportStatus[0]?.label || ""}`}</b>
                  )}
                </div>
                <div>
                  <b>
                    Delivery Date:{" "}
                    {_dateFormatterTwo(shippingPrint?.objHeader?.shipmentDate)}{" "}
                  </b>{" "}
                  <br />
                  <b>
                    Vehicle Name: {shippingPrint?.objHeader?.strVehicleName}
                  </b>
                  <br />
                  <b>
                    Vehicle Owner Name:{" "}
                    {shippingPrint?.objHeader?.ownerTypeName}
                  </b>{" "}
                  {/* <b>
                    Vehicle Volume:{" "}
                    {shippingPrint?.objHeader?.unloadVehicleVolume}
                  </b> */}
                  <br />
                  <b>
                    Vehicle Weight (Kg):{" "}
                    {shippingPrint?.objHeader?.vehicleEntryId
                      ? shippingPrint?.objHeader?.netWeight
                      : shippingPrint?.objHeader?.unloadVehicleWeight}
                  </b>
                  {/* <b>
                    Total Net Weight:{" "}
                    {`${shippingPrint?.objHeader?.totalNetWeight}`}
                  </b> */}
                  <br />
                  <b>
                    Contact Info:{" "}
                    {`${shippingPrint?.objHeader?.shipToPartnerContactNo ||
                      ""}`}
                  </b>
                  {(buId === 171 || buId === 224) && (
                    <>
                      <br />
                      <b>
                        Product Type:{" "}
                        {`${shippingPrint?.objHeader?.productType || ""}`}
                      </b>
                    </>
                  )}
                  {buId === 171 || buId === 224 ? (
                    <>
                      <br />
                      <b>
                        Sold To Party Name:{" "}
                        {`${shippingPrint?.objHeader?.soldToPartnerName || ""}`}
                      </b>
                    </>
                  ) : null}
                  <br />
                  <b>
                    Complete Date:{" "}
                    {_dateFormatterTwo(shippingPrint?.objHeader?.completeDate)}
                  </b>
                  <br />
                  <b>Packer Name: {shippingPrint?.objHeader?.packerName}</b>
                  <br />
                  {(buId === 171 || buId === 224) && (
                    <b>
                      Unload by Company:{" "}
                      {transportStatus[0]?.labourstatus ? "Yes" : "No"}
                    </b>
                  )}
                </div>
              </div>

              <div className=" my-5">
                <ICustomTable ths={ths}>
                  {shippingPrint?.objRow?.map((itm, index) => {
                    totalQuantity += itm?.quantity;
                    totalItemPrice += itm?.itemPrice;
                    totalAmount +=
                      (+itm?.itemPrice || 0) * (+itm?.quantity || 0);
                    return (
                      <tr key={index}>
                        <td>
                          <div className="text-left">{itm?.customerName} </div>
                        </td>
                        <td> {itm?.customerAddress}</td>
                        <td> {itm?.deliveryCode}</td>
                        <td> {itm?.salesOrderCode}</td>
                        <td className="text-center"> {itm?.itemCode}</td>
                        <td>
                          {[144, 188, 189].includes(buId)
                            ? itm?.itemSalesName
                            : itm?.itemName}
                        </td>
                        <td>{itm?.uomName}</td>
                        <td className="text-center">{itm?.quantity}</td>
                        {/* Akij Essential Limited === 144 */}
                        {[144].includes(buId) && (
                          <>
                            <td className="text-center">{itm?.itemPrice}</td>
                            <td className="text-center">
                              {(+itm?.itemPrice || 0) * (+itm?.quantity || 0)}
                            </td>
                          </>
                        )}

                        {/* <td className="text-center">{itm?.deliveryValue}</td> */}
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan="7" className="text-left">
                      <p className="text-left m-0 ml-1">
                        <b>Total Quantity:</b>
                      </p>
                    </td>
                    <td className="text-center">
                      <b>{totalQuantity}</b>
                    </td>
                    {/* Akij Essential Limited === 144 */}
                    {[144].includes(buId) && (
                      <>
                        {" "}
                        <td className="text-center">
                          <b>{totalItemPrice}</b>
                        </td>
                        <td className="text-center">
                          <b>{totalAmount}</b>
                        </td>
                      </>
                    )}
                  </tr>
                </ICustomTable>
              </div>
            </div>
            {/* <div
              className="d-flex justify-content-between"
              style={{ margin: "70px 0 0" }}
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
            </div> */}
          </div>
        </div>
      </ICard>
    </>
  );
}
