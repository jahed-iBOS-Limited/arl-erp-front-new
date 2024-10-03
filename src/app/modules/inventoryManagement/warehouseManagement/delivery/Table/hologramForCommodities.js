import React, { useRef } from "react";
import Barcode from "react-barcode";
import { shallowEqual, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import signature_of_pran_krishna_kundo from "../../../../_helper/images/signatureOf_pran_krishno_kundo.png";
import signature_of_rasel_sardar from "../../../../_helper/images/signature_of_rasel_sardar.png";
import "./hologramForCommodities.css";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import moment from "moment";
import IButton from "../../../../_helper/iButton";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
const HologramPrintForAkijCommodities = ({ printDataList }) => {
  const printRef = useRef();

  // get user data from store
  const {
    // profileData: { employeeFullName: empName },
    selectedBusinessUnit: { label: buName, address },
  } = useSelector((state) => state?.authData, shallowEqual);

  const printHandler = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Customer Copy",
    pageStyle:
      "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {A5 landscape !important}}",
  });

  return (
    <>
      <IButton onClick={() => printHandler()}>Print</IButton>
      <div className="" ref={printRef}>
        {printDataList?.map((printData) => {
          const {
            salesOrderCode,
            soldToPartnerName,
            rowList,
            shippingPoint,
            // contactPerson,
            // phoneNumber,
            soldToPartnerCode,
            shipToPartnerName,
            // shipToPartnerContact,
            shipToPartnerAddress,
            shipToPartnerPropitorName,
            deliveryCode,
            soldToPartnerAddress,
            businessPartnerContact = "",
            salesOrderDate,
          } = printData;

          let totalQty = 0;
          let totalQtyBag = 0;
          return (
            <div className="page-break CommoditiesHologram_wrapper">
              <div
                style={{
                  borderBottom: "1px solid black",
                  paddingBottom: "20px",
                }}
              >
                <div className="CommoditiesHologram_header">
                  {/* <div className="logo" style={{ width: "275px" }}></div> */}

                  <div className="text-center">
                    <p
                      style={{
                        fontSize: "45px",
                        fontWeight: "500",
                        color: "#303399",
                      }}
                    >
                      {buName}
                    </p>
                    <p style={{ fontSize: "14px" }}>{address}</p>

                    <p style={{ fontSize: "14px" }}>
                      Phone: 08444416609, 08000555777
                      <br />
                      Email: trading@akijcommodities.com
                    </p>
                  </div>

                  <div
                    style={{
                      width: "280px",
                      paddingRight: "30px",
                      paddingTop: "30px",
                      position: "absolute",
                      right: "-10px",
                      top: "15px",
                    }}
                  >
                    {deliveryCode !== "" ? (
                      // {salesOrderCode !== "" ? (
                      <Barcode
                        value={deliveryCode ? deliveryCode : ""}
                        // value={salesOrderCode ? salesOrderCode : ""}
                        lineColor="black"
                        displayValue={false}
                        height={50}
                      />
                    ) : (
                      <p>No barcode preview</p>
                    )}
                  </div>
                </div>
                <div className="text-center mt-3">
                  <h3
                    style={{
                      width: "161px",
                      margin: "auto",
                      border: "1px solid black",
                      padding: "2px",
                      borderRadius: "5px",
                    }}
                  >
                    DELIVERY ORDER
                  </h3>
                </div>
              </div>
              <div className="d-flex" style={{ paddingLeft: "25px" }}>
                <div style={{ width: "100%" }}>
                  <div className="table-responsive">
                    <table className="table delivery_challan_top_table mt-8">
                      <tbody>
                        <tr>
                          <td>SO Code</td>
                          <td>:</td>
                          <td>
                            <b>{salesOrderCode}</b>
                          </td>
                          <td>DO Code</td>
                          <td>:</td>
                          <td>
                            <b>{deliveryCode}</b>
                          </td>
                        </tr>
                        <tr>
                          <td>SO Date</td>
                          <td>:</td>
                          <td>{_dateFormatter(salesOrderDate)}</td>

                          <td>Customer Code</td>
                          <td>:</td>
                          <td>
                            <b>{soldToPartnerCode}</b>
                          </td>
                        </tr>
                        <tr>
                          <td>Sold To Partner</td>
                          <td>:</td>
                          <td>
                            <b>{soldToPartnerName}</b>
                          </td>

                          <td style={{ width: "120px" }}>Delivery From</td>
                          <td>:</td>
                          <td>{shippingPoint}</td>
                        </tr>
                        <tr>
                          <td>Sold to Partner Address</td>
                          <td>:</td>
                          <td>{soldToPartnerAddress}</td>

                          <td style={{ width: "120px" }}>ShipPoint</td>
                          <td>:</td>
                          <td>{shippingPoint}</td>
                        </tr>
                        <tr>
                          <td>Ship To Partner</td>
                          <td>:</td>
                          <td>{shipToPartnerName}</td>

                          <td>Contact No</td>
                          <td>:</td>
                          <td>{businessPartnerContact}</td>
                        </tr>
                        <tr>
                          <td>Ship to Partner Address</td>
                          <td>:</td>
                          <td>{shipToPartnerAddress}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="main_table" style={{ marginTop: "20px" }}>
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Item Code</th>
                            <th>Product Description</th>
                            <th>UoM</th>
                            <th>Weight (M.ton)</th>
                            <th>Quantity (Bag)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowList?.map((item, index) => {
                            totalQty += item?.deliveryQuantity;
                            totalQtyBag += item?.deliveryQuantityBag;
                            return (
                              <tr className="text-center">
                                <td>{index + 1}</td>
                                <td className="CommoditiesHologram_table_td">
                                  <b>{item?.itemCode}</b>
                                </td>
                                <td className="CommoditiesHologram_table_td">
                                  <b>{item?.itemName}</b>
                                </td>
                                <td>{item?.uomName}</td>
                                <td>
                                  {_fixedPoint(item?.deliveryQuantity, true)}
                                </td>
                                <td>
                                  {_fixedPoint(item?.deliveryQuantityBag, true)}
                                </td>
                              </tr>
                            );
                          })}
                          <tr style={{ fontWeight: "bold" }}>
                            <td className="text-center" colSpan={4}>
                              Total
                            </td>
                            <td className="text-center">
                              {_fixedPoint(totalQty, true)}
                            </td>
                            <td className="text-center">
                              {_fixedPoint(totalQtyBag, true)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    writingMode: "vertical-rl",
                    paddingTop: "70px",
                  }}
                  className="text-center"
                >
                  <h2 style={{ color: "#eb2f06" }}>
                    CUSTOMER COPY
                  </h2>
                </div>
              </div>

              <div className="signature_wrapper">
                <div className="first signature" style={{ marginTop: "90px" }}>
                  <p>Prepared By</p>
                </div>

                <div className="third signature" style={{ marginTop: "90px" }}>
                  <p>Received By</p>
                </div>
                <div className="third signature">
                  <img
                    src={signature_of_rasel_sardar}
                    alt="signature"
                    style={{ height: "70px" }}
                  />

                  <p>Checked By</p>
                </div>
                <div className="third signature">
                  <img
                    src={signature_of_pran_krishna_kundo}
                    alt="signature"
                    style={{ height: "70px" }}
                  />

                  <p>Approved By</p>
                </div>
              </div>
              <p className="printing_date_time">
                Printing Date & Time: {moment().format("DD-MM-YYYY HH:mm:ss")}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default HologramPrintForAkijCommodities;
