import Axios from "axios";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICard from "../../../../../_helper/_card";
import ISpinner from "../../../../../_helper/_spinner";
import bluePill_logo from "./../../../../../_helper/images/bluePill_logo.png";
import cement_log from "./../../../../../_helper/images/cement_logo.png";
import "./style.css";
// import moment from "moment";
// import { _dateFormatterTwo } from "../../../../../_helper/_dateFormate";
import { useLocation } from "react-router";
import { _currentTime } from "../../../../../_helper/_currentTime";
import { _todayDate } from "../../../../../_helper/_todayDate";
import BongTradersTable from "./bongTradersTable";
import CommonTable from "./commonTable";
export default function DeliveryReport({ id }) {
  const [loading, setLoading] = React.useState(false);
  const { state: landingData } = useLocation();

  let { selectedBusinessUnit, profileData } = useSelector(
    (state) => {
      return {
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        profileData: state.authData.profileData,
      };
    },
    { shallowEqual }
  );
  const [deliveryOrderReportData, setDeliveryOrderReporData] = useState([]);

  const getDeliveryChallanInfoById = async (id) => {
    setLoading(true);
    try {
      const res = await Axios.get(
        `/wms/ShopBySales/GetDeliveryChallanByDeliveryId?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&DeliveryId=${id}`
      );
      setLoading(false);
      const modified = res?.data?.[0]?.rows?.map((itm) => ({
        ...itm,
        weight: +itm?.weight?.toFixed(3),
      }));
      setDeliveryOrderReporData({ ...res?.data?.[0], rows: modified });
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value && id) {
      getDeliveryChallanInfoById(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, id]);
  const {
    challanNo,
    deliveryOrder,
    soldToPartner,
    address,
    driver,
    contactNo,
    charge,
    logistic,
    driverContact,
    contactPerson,
    vehicleNo,
    shipToPartner,
    shippointName,
    deliveryAt,
    productType,
    orderReferenceNo,
    warehouseName,
  } = deliveryOrderReportData;

  let totalQuantity = deliveryOrderReportData?.rows?.reduce(
    (acc, cur) => acc + cur?.quantity || 0,
    0
  );
  let totalBundel = deliveryOrderReportData?.rows?.reduce(
    (acc, cur) => (acc += cur?.bundel),
    0
  );
  let totalPieces = deliveryOrderReportData?.rows?.reduce(
    (acc, cur) => (acc += cur?.pieces),
    0
  );
  let totalRate = deliveryOrderReportData?.rows?.reduce(
    (acc, cur) => (acc += +cur?.itemPrice || 0),
    0
  );

  let totalAmount = deliveryOrderReportData?.rows?.reduce(
    (acc, cur) => (acc += (+cur?.itemPrice || 0) * (+cur?.quantity || 0)),
    0
  );
  if (loading) {
    return loading && <ISpinner isShow={loading} />;
  }
  return (
    <>
      <ICard printTitle="Print" title="">
        <div>
          <div
            style={
              selectedBusinessUnit?.value === 186 ? { marginTop: "2rem" } : {}
            }
            className={`mx-auto print_wrapper delivery_challan_print_wrapper ${selectedBusinessUnit?.value ===
              178 && "bongoTradersLtdChalanPrintMargin"}`}
          >
            <div className="borderTop">
              <div className="text-center my-2 delivery_challan">
                <h2>
                  {" "}
                  {landingData?.status?.value === false
                    ? "DELIVERY ORDER"
                    : "DELIVERY CHALLAN"}
                </h2>
                <b className="display-5">{selectedBusinessUnit?.label}</b>
                <br />
                <b className="display-5"> {selectedBusinessUnit?.address} </b>
                {selectedBusinessUnit?.value === 4 && (
                  <img src={cement_log} alt="Akij Cement Logo" />
                )}
                {selectedBusinessUnit?.value === 186 && (
                  <img
                    style={{
                      height: "80px",
                      paddingLeft: "20px",
                      paddingBottom: "10px",
                    }}
                    src={bluePill_logo}
                    alt="Blue Pill Logo"
                  />
                )}
              </div>
              {/* <div className="d-flex justify-content-between">
                <div>
                  <b>
                    Customer Name : {deliveryOrderReportHeader?.customerName}
                  </b>
                  <br />
                  <b>
                    Shiping Address :
                    {deliveryOrderReportHeader?.shippingAddress}
                  </b>
                  <br />
                  <b>
                    Customer Phone No :
                    {deliveryOrderReportHeader?.customerContactNo}
                  </b>
                  <br />
                  <b>
                    Shipment Posted :
                    {`${deliveryOrderReportHeader?.isShipmentPosted}`}
                  </b>
                </div>
                <div>
                  <b>
                    Delivery From : {deliveryOrderReportHeader?.deliveryFrom}
                  </b>
                  <br />
                  <b>Delivery No: {deliveryOrderReportHeader?.deliveryCode}</b>
                  <br />
                  <b>
                    Delivery Date:
                    {_dateFormatter(deliveryOrderReportHeader?.deliveryDate)}
                  </b>
                </div>
              </div> */}
              <div className="table-responsive">
                <table className="table delivery_challan_top_table mt-8">
                  <tbody>
                    <tr>
                      <td style={{ width: "107px" }}>
                        <b>Challan No</b>
                      </td>
                      <td>:</td>
                      <td>
                        <b>{challanNo}</b>
                      </td>
                      <td style={{ width: "120px" }}>Delivery From</td>
                      <td>:</td>
                      <td>{warehouseName}</td>
                    </tr>
                    <tr>
                      <td>Sold To Partner</td>
                      <td>:</td>
                      <td>{soldToPartner}</td>
                      <td style={{ width: "120px" }}>ShipPoint</td>
                      <td>:</td>
                      <td>{shippointName}</td>
                    </tr>
                    <tr>
                      <td>Ship To Partner</td>
                      <td>:</td>
                      <td>{shipToPartner}</td>{" "}
                      <td style={{ width: "120px" }}>Delivery Order</td>
                      <td>:</td>
                      <td>{deliveryOrder}</td>
                    </tr>
                    <tr>
                      <td>Address</td>
                      <td>:</td>
                      <td>{address}</td> <td>Delivery At</td>
                      <td>:</td>
                      <td>{deliveryAt}</td>
                    </tr>
                    <tr>
                      <td>Contact Person</td>
                      <td>:</td>
                      <td>{contactPerson}</td> <td>Vehicle</td>
                      <td>:</td>
                      <td>{vehicleNo}</td>
                    </tr>
                    <tr>
                      <td>Contact No</td>
                      <td>:</td>
                      <td>{contactNo}</td> <td>Logistic</td>
                      <td>:</td>
                      <td>{logistic}</td>
                    </tr>
                    <tr>
                      <td>Charge</td>
                      <td>:</td>
                      <td>{charge}</td> <td>Driver</td>
                      <td>:</td>
                      <td>{driver}</td>
                    </tr>
                    <tr>
                      <td>Order Ref. No</td>
                      <td>:</td>
                      <td>{orderReferenceNo}</td>
                      <td>Driver Contact No</td>
                      <td>:</td>
                      <td>{driverContact}</td>
                    </tr>
                    {(selectedBusinessUnit?.value === 171 ||
                      selectedBusinessUnit?.value === 224) && (
                      <>
                        {" "}
                        <tr>
                          <td>Total Bundle</td>
                          <td>:</td>
                          <td>{totalBundel}</td>
                          <td>Product Type</td>
                          <td>:</td>
                          <td>{productType}</td>
                        </tr>
                        <tr>
                          <td>Total Pieces</td>
                          <td>:</td>
                          <td>{totalPieces}</td>
                          <td>Printed At</td>
                          <td>:</td>
                          <td>{`${_todayDate()} ${" "} ${_currentTime()}`}</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              {/* if Bongo Traders Ltd  check*/}
              {selectedBusinessUnit?.isTredingBusiness ? (
                <BongTradersTable
                  deliveryOrderReportData={deliveryOrderReportData}
                  totalQuantity={totalQuantity}
                  totalRate={totalRate}
                  totalAmount={totalAmount}
                />
              ) : (
                <CommonTable
                  deliveryOrderReportData={deliveryOrderReportData}
                  totalQuantity={totalQuantity}
                  selectedBusinessUnit={selectedBusinessUnit}
                  totalPieces={totalPieces}
                  totalBundel={totalBundel}
                  totalRate={totalRate}
                  totalAmount={totalAmount}
                />
              )}

              <div
                className="d-flex justify-content-between"
                style={{ margin: "80px 0 0" }}
              >
                <div>
                  <b style={{ borderTop: "1px solid", padding: "5px 0 0" }}>
                    Officer
                  </b>
                </div>
                <div>
                  <b style={{ borderTop: "1px solid", padding: "5px 0 0" }}>
                    Driver's Signature
                  </b>
                </div>
                <div>
                  <b style={{ borderTop: "1px solid", padding: "5px 0 0" }}>
                    Receiver's Signature With Seal & Date
                  </b>
                </div>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </ICard>
    </>
  );
}
