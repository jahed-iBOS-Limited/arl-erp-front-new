import React, { useRef } from "react";
import Barcode from "react-barcode";
import { shallowEqual, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import IButton from "../../../../_helper/iButton";
import signature_of_pran_krishna_kundo from "../../../../_helper/images/signatureOf_pran_krishno_kundo.png";
import signature_of_rasel_sardar from "../../../../_helper/images/signature_of_rasel_sardar.png";
import "./InvoiceRecept.css";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
const HologramPrintForAkijCommodities = ({ setShow, printData }) => {
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
      "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}",
  });

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
    <>
      <IButton onClick={() => printHandler()}>Print</IButton>
      <div className="hologram_wrapper" ref={printRef}>
        <div style={{ borderBottom: "1px solid black", paddingBottom: "20px" }}>
          <div className="hologram_header">
            <div className="logo" style={{ width: "30%" }}></div>

            <div className="text-center">
              <p style={{ fontSize: "35px", fontWeight: "500" }}>{buName}</p>
              <p style={{ fontSize: "14px" }}>{address}</p>

              <p style={{ fontSize: "14px" }}>
                Phone: 08444416609, 08000555777
                <br />
                Email: trading@akijcommodities.com
              </p>
            </div>

            <div
              style={{ width: "30%", paddingRight: "30px", paddingTop: "30px" }}
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
            <h3>SUPPLY ORDER</h3>
          </div>
        </div>
        <div className="d-flex" style={{ paddingLeft: "25px" }}>
          <div style={{ width: "100%" }}>
            <table className="table delivery_challan_top_table mt-8">
              <tbody>
                <tr>
                  <td>Customer Code</td>
                  <td>:</td>
                  <td>{soldToPartnerCode}</td>
                  <td style={{ width: "120px" }}>Delivery From</td>
                  <td>:</td>
                  <td>{shippingPoint}</td>
                </tr>
                <tr>
                  <td>Sold To Partner</td>
                  <td>:</td>
                  <td>{soldToPartnerName}</td>
                  <td style={{ width: "120px" }}>ShipPoint</td>
                  <td>:</td>
                  <td>{shippingPoint}</td>
                </tr>
                <tr>
                  <td>Ship To Partner</td>
                  <td>:</td>
                  <td>{rowList[0]?.shiptoPartnerName}</td>{" "}
                  <td>Contact Person</td>
                  <td>:</td>
                  <td>{rowList[0]?.shiptoPartnerName}</td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>:</td>
                  <td>{rowList[0]?.shiptoPartnerAddress}</td>{" "}
                  <td>Contact No</td>
                  <td>:</td>
                  <td>{phoneNumber}</td>
                </tr>
              </tbody>
            </table>
            <div className="main_table" style={{ marginTop: "30px" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Product Description</th>
                    <th>UoM</th>
                    <th>Quantity (bag)</th>
                    <th>Quantity (M.ton)</th>
                  </tr>
                </thead>
                <tbody>
                  {rowList?.map((item, index) => {
                    totalQty += item?.orderQuantity;
                    totalQtyInBag += item?.orderQuantityBag;
                    return (
                      <tr>
                        <td className="text-center">{index + 1}</td>
                        <td>{item?.itemName}</td>
                        <td>{item?.uomName}</td>
                        <td className="text-right">
                          {_fixedPoint(item?.orderQuantityBag, true)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.orderQuantity, true)}
                        </td>
                      </tr>
                    );
                  })}
                  <tr style={{ fontWeight: "bold" }}>
                    <td className="text-right" colSpan={3}>
                      Total
                    </td>
                    <td className="text-right">
                      {_fixedPoint(totalQtyInBag, true)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(totalQty, true)}
                    </td>
                  </tr>
                </tbody>
              </table>
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
        {/* <footer
          className="footer"
          style={{ bottom: 0, position: "fixed", display: "none" }}
        >
          <h4 style={{ color: "#11067e" }}>
            <b>
              [N.B.: Delivery should be taken within 15 (Fifteen) Days
              hereafter]
            </b>
          </h4>
        </footer> */}
      </div>
    </>
  );
};

export default HologramPrintForAkijCommodities;
