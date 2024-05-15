import React from "react";
import "./InvoiceRecept.css";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { ToWords } from "to-words";
import { shallowEqual, useSelector } from "react-redux";
// import { APIUrl } from "../../../../../App";
// import logo from "../../../../_helper/images/bluePill_logo.png";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import { bluePillLetterhead } from "../base64Images/bluePill";

const InvoiceReceptBluePill = ({ printRef, invoiceData }) => {
  let totalAmount = 0;
  let discountAmount = 0;
  let vatTotal = invoiceData?.[0]?.vatTotal || 0;

  const toWords = new ToWords({
    localeCode: "en-BD",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
    },
  });

  // get user data from store
  const {
    profileData: { employeeFullName: empName },
  } = useSelector((state) => state?.authData, shallowEqual);

  return (
    <div
      className="print_invoice_wrapper_bluePill"
      ref={printRef}
      style={{
        backgroundImage: `url(${bluePillLetterhead})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        width: "100%",
        height: "100%",
      }}
    >
      {/* <div className="header">
        <div className="office_info">
          <p>
            Website: <a href="/">www.bluepill.com.bd</a>{" "}
          </p>
          <p>Email: info@bluepill.com.bd</p>
        </div>

        <div className="logo">
          <img
            style={{ width: "120px", height: "120px" }}
            // src={`${APIUrl}/domain/Document/DownlloadFile?id=${imgId}`}
            src={logo}
            alt="Logo"
          />
        </div>
      </div> */}
      <div style={{ margin: "0 40px" }}>
        <p
          style={{ fontSize: "40px", fontWeight: "500", marginTop: "120px" }}
          className="text-center"
        >
          INVOICE
        </p>
        <div className="row mt-4">
          <div style={{ width: "50%" }} className="col-lg-6">
            <p>
              <b>Invoice No: </b>
              {invoiceData[0]?.strInvoiceNo}
            </p>
            <p>
              <b>Sold to: </b>
              {invoiceData[0]?.customerName}
            </p>
            <p>
              <b>Address: </b>
              {invoiceData[0]?.businessPartnerAddress}
            </p>
            <p>
              <b>Contact Person: </b>
              {invoiceData[0]?.contactPerson}
            </p>
            <p>
              <b>Challan No: </b>
              {invoiceData[0]?.allDeliveryCode}
            </p>
            <p>
              <b>Stock Location: </b>
              {invoiceData[0]?.projLocation}
            </p>
          </div>

          <div
            style={{
              width: "50%",
              display: "flex",
              justifyContent: "flex-end",
            }}
            className="col-lg-6"
          >
            <div>
              <p>
                <b>Date: </b>
                {_dateFormatter(new Date())}
              </p>
              <p>
                <b>Sold By: </b>
                {invoiceData[0]?.strSoldByName}
              </p>
              <p>
                <b>Invoice Created By: </b>
                {empName}
              </p>
              <p>
                <b>Sales Order Created By: </b>
                {invoiceData[0]?.strSalesOrderCreatedBy}
              </p>
              <p>
                <b>SO No: </b>
                {invoiceData[0]?.allSOCode}
              </p>
              <p>
                <b>Party Ref No: </b>
                {invoiceData[0]?.referance}
              </p>
            </div>
          </div>
        </div>

        <div className="main_table">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Product Description</th>
                  <th>Customer Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData?.map((item, index) => {
                  totalAmount += item?.totalAmount || 0;
                  return (
                    <tr>
                      <td className="text-center">{index + 1}</td>
                      <td
                        style={{
                          minWidth: "192px",
                        }}
                      >
                        {item?.itemName}
                      </td>
                      <td>{item?.customerItemName}</td>
                      <td className="text-right">
                        {item?.totalDeliveredQtyCFT}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.itemRate, true, 0)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.totalAmount, true)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-end">
            <div>
              <p>
                <b>SUBTOTAL: </b>
                <span>{_fixedPoint(totalAmount, true)}</span>
              </p>
              <p>
                <b>DISCOUNT: </b>
                <span>{_fixedPoint(discountAmount, true)}</span>
              </p>
              <p>
                <b>VAT: </b>
                <span>{_fixedPoint(vatTotal, true)}</span>
              </p>
              <p>
                <b>GRAND TOTAL: </b>
                <span>
                  {_fixedPoint(totalAmount + vatTotal - discountAmount, true)}
                </span>
              </p>
            </div>
          </div>

          <div colspan="7" className="bold">
            IN WORD:{" "}
            <span style={{ textTransform: "uppercase" }}>
              {toWords.convert(
                (totalAmount + vatTotal - discountAmount).toFixed(0)
              )}
            </span>
          </div>
          <div colspan="7">
            <b>Remarks:</b> <span>{invoiceData[0]?.remarks}</span>
          </div>
          <div colspan="7">
            <b>Credit Period:</b> <span>{invoiceData[0]?.strPaymentTerms}</span>
          </div>
        </div>
        <div className="signature_wrapper">
          <div className="first signature">
            <p>Signature and Company Stamp</p>
            <small>
              Goods Sold and once received or accepted by the customers <br />{" "}
              are not returnable. Warranty will avoid of all products if sticker
              is removed
            </small>
          </div>

          <div className="third signature">
            <p>Authorized Signature and Company Stamp</p>
          </div>
        </div>
      </div>
      {/* <footer style={{ position: "fixed", bottom: 0 }}>
        <p>
          Address: Akij House, 198, Bir Uttam Mir Shawkat Sarak(Gulshan-Tejgaon
          Link Road), Tejgaon I/A, Dhaka-1208
        </p>
        <p>
          Hotline: 16609, Toll Free: 08000016609, Group Website:{" "}
          <a href="/" style={{ textDecoration: "none" }}>
            www.akij.net
          </a>
        </p>
      </footer> */}
    </div>
  );
};

export default InvoiceReceptBluePill;
