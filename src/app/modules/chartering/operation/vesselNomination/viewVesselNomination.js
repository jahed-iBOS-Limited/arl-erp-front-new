import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import "./style.css";
import { useLocation } from "react-router";
import ICard from "../../../_helper/_card";
export default function ViewVesselNomination() {
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
  const [viewVesselNomiData, setViewVesselNomiData] = useState([]);


  return (
    <>
      <ICard printTitle="" title="">
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
                </h2>
                <b className="display-5">{selectedBusinessUnit?.label}</b>
                <br />
                <b className="display-5"> {selectedBusinessUnit?.address} </b>
                
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
                        <b>{viewVesselNomiData?.challanNo}</b>
                      </td>
                      <td style={{ width: "120px" }}>Delivery From</td>
                      <td>:</td>
                      <td>{viewVesselNomiData?.warehouseName}</td>
                    </tr>
                    <tr>
                      <td>Sold To Partner</td>
                      <td>:</td>
                      <td>{viewVesselNomiData?.soldToPartner}</td>
                      <td style={{ width: "120px" }}>ShipPoint</td>
                      <td>:</td>
                      <td>{viewVesselNomiData?.shippointName}</td>
                    </tr>
                    <tr>
                      <td>Ship To Partner</td>
                      <td>:</td>
                      <td>{viewVesselNomiData?.shipToPartner}</td>{" "}
                      <td style={{ width: "120px" }}>Delivery Order</td>
                      <td>:</td>
                      <td>{viewVesselNomiData?.deliveryOrder}</td>
                    </tr>
                    <tr>
                      <td>Address</td>
                      <td>:</td>
                      <td>{viewVesselNomiData?.address}</td> <td>Delivery At</td>
                      <td>:</td>
                      <td>{viewVesselNomiData?.deliveryAt}</td>
                    </tr>
                    <tr>
                      <td>Contact Person</td>
                      <td>:</td>
                      <td>{viewVesselNomiData?.contactPerson}</td> <td>Vehicle</td>
                      <td>:</td>
                      <td>{viewVesselNomiData?.vehicleNo}</td>
                    </tr>
                    <tr>
                      <td>Contact No</td>
                      <td>:</td>
                      <td>{viewVesselNomiData?.contactNo}</td> <td>Logistic</td>
                      <td>:</td>
                      <td>{viewVesselNomiData?.logistic}</td>
                    </tr>
                    <tr>
                      <td>Charge</td>
                      <td>:</td>
                      <td>{viewVesselNomiData?.charge}</td> <td>Driver</td>
                      <td>:</td>
                      <td>{viewVesselNomiData?.driver}</td>
                    </tr>
                    <tr>
                      <td>Order Ref. No</td>
                      <td>:</td>
                      <td>{viewVesselNomiData?.orderReferenceNo}</td>
                      <td>Driver Contact No</td>
                      <td>:</td>
                      <td>{viewVesselNomiData?.driverContact}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* <div
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
              </div> */}
            </div>
            <div></div>
          </div>
        </div>
      </ICard>
    </>
  );
}
