import React, { useRef } from "react";
import Barcode from "react-barcode";
import { shallowEqual, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import IButton from "../../../../_helper/iButton";
// import logo from "../../../../_helper/images/commodities_logo.jpg";
import signature_of_pran_krishna_kundo from "../../../../_helper/images/signature_of_pran_krishno_kundo.png";
import "./InvoiceRecept.css";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
// import QRCode from "qrcode.react";

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
    contactPerson,
    phoneNumber,
  } = printData;

  let totalQty = 0;

  return (
    <>
      <IButton onClick={() => printHandler()}>Print</IButton>
      <div className="hologram_wrapper" ref={printRef}>
        <div style={{ borderBottom: "1px solid black" }}>
          <div className="hologram_header">
            <div className="logo" style={{ width: "30%" }}>
              {/* <img
                // style={{ width: "70px", height: "70px" }}
                src={logo}
                alt="Logo"
              /> */}
            </div>

            <div className="text-center">
              <p style={{ fontSize: "35px", fontWeight: "500" }}>{buName}</p>
              <small>{address}</small>
              <br />
              <small>
                Phone: 08444416609, 08000555777, Email:
                info@youreverydayessentials.com
              </small>
            </div>
            {/* <div className="office_info">
              <QRCode
                data-qr={"Sales Order Code"}
                value={salesOrderCode}
                size={70}
              /> 
            </div> */}
            <div style={{ width: "30%" }}>
              {salesOrderCode !== "" ? (
                <Barcode
                  value={salesOrderCode ? salesOrderCode : ""}
                  lineColor="black"
                  displayValue={false}
                  height={60}
                />
              ) : (
                <p>No barcode preview</p>
              )}
            </div>
          </div>
          <div className="text-center">
            <h3>SALES ORDER</h3>
          </div>
        </div>
        <div className="d-flex">
          <div style={{ width: "100%" }}>
            <table className="table delivery_challan_top_table mt-8">
              <tbody>
                <tr>
                  <td>Sold To Partner</td>
                  <td>:</td>
                  <td>{soldToPartnerName}</td>
                  <td style={{ width: "120px" }}>Delivery From</td>
                  <td>:</td>
                  <td>{shippingPoint}</td>
                </tr>
                <tr>
                  <td>Ship To Partner</td>
                  <td>:</td>
                  <td>{rowList[0]?.shiptoPartnerName}</td>{" "}
                  <td style={{ width: "120px" }}>ShipPoint</td>
                  <td>:</td>
                  <td>{shippingPoint}</td>
                </tr>

                <tr>
                  <td>Address</td>
                  <td>:</td>
                  <td>{rowList[0]?.shiptoPartnerAddress}</td>{" "}
                  <td>Contact Person</td>
                  <td>:</td>
                  <td>{contactPerson}</td>
                </tr>
                <tr>
                  <td>Contact No</td>
                  <td>:</td>
                  <td>{phoneNumber}</td>
                </tr>
              </tbody>
            </table>
            <div className="main_table">
              <table className="table">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Product Description</th>
                    <th>UoM</th>
                    <th>Order Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {rowList?.map((item, index) => {
                    totalQty += item?.orderQuantity;
                    return (
                      <tr>
                        <td className="text-center">{index + 1}</td>
                        <td>{item?.itemName}</td>
                        <td>{item?.uomName}</td>
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
              transform: "rotate(180deg)",
            }}
            className="text-center"
          >
            <h1>CUSTOMER COPY</h1>
          </div>
        </div>

        <div className="signature_wrapper">
          <div className="first signature">
            <p style={{ marginTop: "90px" }}>Prepared By</p>
          </div>

          <div className="third signature">
            <p style={{ marginTop: "90px" }}>Received By</p>
          </div>
          <div className="third signature">
            <p style={{ marginTop: "90px" }}>Checked By</p>
          </div>
          <div className="third signature">
            <img
              src={signature_of_pran_krishna_kundo}
              alt="signature"
              style={{ width: "100px" }}
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
