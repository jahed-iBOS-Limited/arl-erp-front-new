import React, { useRef } from "react";
import Barcode from "react-barcode";
import { shallowEqual, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import IButton from "../../../../_helper/iButton";
import signature_of_pran_krishna_kundo from "../../../../_helper/images/signatureOf_pran_krishno_kundo.png";
import signature_of_rasel_sardar from "../../../../_helper/images/signature_of_rasel_sardar.png";
import "./hologramForCommodities.css";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import moment from "moment";
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
            phoneNumber,
            soldToPartnerCode,
          } = printData;

          let totalQty = 0,
            totalQtyInBag = 0;
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
                    <p style={{ fontSize: "35px", fontWeight: "500" }}>
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
                      width: "274px",
                      paddingRight: "30px",
                      paddingTop: "30px",
                      position: "absolute",
                      right: "-33px",
                      top: "15px",
                    }}
                  >
                    {salesOrderCode !== "" ? (
                      <Barcode
                        value={salesOrderCode ? salesOrderCode : ""}
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
                    SUPPLY ORDER
                  </h3>
                </div>
              </div>
              <div className="d-flex" style={{ paddingLeft: "25px" }}>
                <div style={{ width: "100%" }}>
                  <div className="table-responsive">
                    <table className="table delivery_challan_top_table mt-8">
                      <tbody>
                        <tr>
                          <td>Customer Code</td>
                          <td>:</td>
                          <td>
                            <b>{soldToPartnerCode}</b>
                          </td>
                          <td style={{ width: "120px" }}>Delivery From</td>
                          <td>:</td>
                          <td>{shippingPoint}</td>
                        </tr>
                        <tr>
                          <td>Sold To Partner</td>
                          <td>:</td>
                          <td>
                            <b>{soldToPartnerName}</b>
                          </td>
                          <td style={{ width: "120px" }}>ShipPoint</td>
                          <td>:</td>
                          <td>{shippingPoint}</td>
                        </tr>
                        <tr>
                          <td>Ship To Partner</td>
                          <td>:</td>
                          <td>{rowList?.[0]?.shiptoPartnerName}</td>{" "}
                          <td>Contact Person</td>
                          <td>:</td>
                          <td>{rowList?.[0]?.shiptoPartnerName}</td>
                        </tr>
                        <tr>
                          <td>Address</td>
                          <td>:</td>
                          <td>{rowList?.[0]?.shiptoPartnerAddress}</td>{" "}
                          <td>Contact No</td>
                          <td>:</td>
                          <td>{phoneNumber}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="main_table" style={{ marginTop: "30px" }}>
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Product Description</th>
                            <th>UoM</th>
                            <th>Quantity</th>
                            <th>Weight (M.ton)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowList?.map((item, index) => {
                            totalQty += item?.orderQuantity;
                            totalQtyInBag += item?.orderQuantityBag;
                            return (
                              <tr>
                                <td className="text-center">{index + 1}</td>
                                <td className="CommoditiesHologram_table_td">
                                  <b>{item?.itemName}</b>
                                </td>
                                <td>{item?.uomName}</td>
                                <td className="text-center">
                                  {_fixedPoint(item?.orderQuantityBag, true)}
                                </td>
                                <td className="text-center">
                                  {_fixedPoint(item?.orderQuantity, true)}
                                </td>
                              </tr>
                            );
                          })}
                          <tr style={{ fontWeight: "bold" }}>
                            <td className="text-right" colSpan={3}>
                              Total
                            </td>
                            <td className="text-center">
                              {_fixedPoint(totalQtyInBag, true)}
                            </td>
                            <td className="text-center">
                              {_fixedPoint(totalQty, true)}
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
                  <h2>CUSTOMER COPY</h2>
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
