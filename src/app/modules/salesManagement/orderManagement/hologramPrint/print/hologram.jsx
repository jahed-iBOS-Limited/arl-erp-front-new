import React, { useRef } from "react";
import Barcode from "react-barcode";
import { shallowEqual, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { ToWords } from "to-words";
import IButton from "../../../../_helper/iButton";
import logo from "../../../../_helper/images/essential.png";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import "./InvoiceRecept.css";
// import QRCode from "qrcode.react";

const HologramPrint = ({ printDataList }) => {
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

  return (
    <>
      <IButton onClick={() => printHandler()}>Print</IButton>
      <div className="hologram_wrapper" ref={printRef}>
        {printDataList?.map((printData) => {
          const {
            salesOrderCode,
            salesOrderDate,
            soldToPartnerId,
            soldToPartnerName,
            soldToPartnerAddress,
            rowList,
            requisitionNumber,
            requisitionDate,
          } = printData;

          let totalQty = 0;

          const toWords = new ToWords({
            localeCode: "en-BD",
            converterOptions: {
              // currency: true,
              ignoreDecimal: false,
              ignoreZeroCurrency: false,
              doNotAddOnly: false,
            },
          });
          return (
            <div className="page-break">
              <div style={{ borderBottom: "1px solid black" }}>
                <div className="hologram_header">
                  <div className="logo">
                    <img
                      // style={{ width: "70px", height: "70px" }}
                      src={logo}
                      alt="Logo"
                    />
                  </div>

                  <div className="text-center">
                    <p style={{ fontSize: "35px", fontWeight: "500" }}>
                      {/* Akij Essential Limited */}
                      {buName}
                    </p>
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
                <div className="text-center">
                  <h3>Delivery Order</h3>
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <div className="main_table">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>DO Number</th>
                        <th>DO Date</th>
                        <th>Requisition Number</th>
                        <th>Requisition Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{salesOrderCode}</td>
                        <td>{_dateFormatter(salesOrderDate)}</td>
                        <td>{requisitionNumber}</td>
                        <td>{_dateFormatter(requisitionDate)}</td>
                      </tr>
                    </tbody>
                  </table>
                  <table className="table mt-3">
                    <tbody>
                      <tr>
                        <td className="text-left">
                          Customer ID: {soldToPartnerId}
                          <br />
                          Customer Name: {soldToPartnerName}
                          <br />
                          Customer Address: {soldToPartnerAddress}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="text-center mt-3">
                    <h1>Fortified Soybean Oil</h1>
                  </div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Description of Goods</th>
                        <th>Quantity</th>
                        <th>Weight in KG</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowList?.map((item, index) => {
                        totalQty += item?.requestQuantity;
                        return (
                          <tr key={index}>
                            <td className="text-left">{item?.itemName}</td>
                            <td className="text-right">
                              {item?.requestQuantity}
                            </td>
                            <td className="text-right">{item?.itemWeightKG}</td>
                            <td>{"n/a"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <table className="table mt-3">
                    <tbody>
                      <tr>
                        <td className="text-left">
                          Quantity in Words:{" "}
                          {toWords.convert(totalQty.toFixed(0))}
                          <br />
                          Unit Price: {rowList[0]?.itemPrice}
                          <br />
                          Amount in Words:{" "}
                          {toWords.convert(rowList[0]?.netValue.toFixed(0))}
                          <br />
                          Delivery Date: {_dateFormatter(salesOrderDate)}
                        </td>
                        <td>
                          Total Value: {_fixedPoint(rowList[0]?.netValue, true)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div
                  style={{ writingMode: "vertical-rl" }}
                  className="text-center"
                >
                  <h1>Customer Copy</h1>
                </div>
              </div>

              <div className="signature_wrapper">
                <div className="first signature">
                  <p>Received By</p>
                </div>

                <div className="third signature">
                  <p>Prepared By</p>
                </div>
                <div className="third signature">
                  <p>Approved By</p>
                </div>
              </div>
              <footer
                className="footer"
                style={{ bottom: 0, position: "fixed", display: "none" }}
              >
                <h4 style={{ color: "#11067e" }}>
                  <b>
                    [N.B.: Delivery should be taken within 15 (Fifteen) Days
                    hereafter]
                  </b>
                </h4>
              </footer>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default HologramPrint;
