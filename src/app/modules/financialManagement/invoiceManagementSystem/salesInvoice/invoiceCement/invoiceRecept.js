import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { ToWords } from "to-words";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
// import background from "../../../../_helper/letterheadImages/akij_cement_letterhead.jpg";
import "./InvoiceRecept.css";
import { cementLetterhead } from "../base64Images/cement";
import { readymixLetterhead } from "../base64Images/readymix";
import { MTSLetterhead } from "../base64Images/mts";
import { essentialLetterhead } from "../base64Images/essential";
import { bluePillLetterhead } from "../base64Images/bluePill";
import { polyFibreLetterhead } from "../base64Images/polyFibre";
import { ispatLetterhead } from "../base64Images/ispat";
import { buildingLetterhead } from "../base64Images/building";

const InvoiceReceptForCement = ({ printRef, invoiceData, channelId }) => {
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
    profileData: { employeeFullName: empName, designationName },
    selectedBusinessUnit: { label: buName, value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  let totalQty = 0;
  let totalNetQty = 0;
  let grandTotal = 0;
  // let totalItemRate = 0;

  const getStyle = {
    fontWeight: "bold",
    fontSize: "16px",
    color: "black !important",
    verticalAlign: "middle",
  };

  const letterhead =
    buId === 175
      ? readymixLetterhead
      : buId === 94
      ? MTSLetterhead
      : buId === 144
      ? essentialLetterhead
      : buId === 4
      ? cementLetterhead
      : buId === 186
      ? bluePillLetterhead
      : buId === 8
      ? polyFibreLetterhead
      : buId === 224
      ? ispatLetterhead
      : buId === 220
      ? buildingLetterhead
      : "";

  return (
    <div>
      {/* <style type="text/css" media="print">
        {`
        @page {
          size: A4 portrait !important;
          padding: 0;
          margin: 30px;
        }
        
          `}
      </style> */}
      <div
        ref={printRef}
        id="print_sales_invoice_wrapper_cement"
        style={{
          backgroundImage: `url(${letterhead})`,
          backgroundRepeat: "no-repeat",
          // backgroundPosition: "center",
          backgroundPosition: "50% 50%",
          backgroundSize: "cover",
          width: "100%",
          height: "100%",
        }}
      >
        {" "}
        <div style={{ margin: "0 50px" }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: "10px",
              marginTop: "120px",
            }}
          >
            <i>
              <p
                style={{
                  fontSize: "30px",
                  textDecoration: "underLine",
                  fontWeight: "bold",
                }}
              >
                Invoice: {invoiceData[0]?.strInvoiceNo}
              </p>
            </i>
          </div>
          <div>
            <p>
              <b>DATE: {_dateFormatter(new Date())}</b>
            </p>
            <p>
              <b>Reference: {invoiceData[0]?.referance}</b>
            </p>
            <br />
            <p>
              <b>{invoiceData[0]?.customerName}</b>
            </p>
            <p>{invoiceData[0]?.businessPartnerAddress}</p>

            <p style={{ margin: "2px 0" }}>
              <strong> Delivery Address:</strong> {invoiceData[0]?.projLocation}
            </p>

            <p>Dear Sir,</p>
            <p>
              We are pleased to issue a bill in favour of our supply as per your
              purchase order.
            </p>
            <br />
          </div>
          <div className="main_table">
            <table className="table">
              <thead>
                <tr>
                  <th style={getStyle}>SL</th>
                  <th style={getStyle}>Item</th>
                  <th style={getStyle}>Sales Order</th>
                  {/* <th style={getStyle}>Destination</th> */}
                  <th style={{ width: "90px", ...getStyle }}>Delivery Date</th>
                  <th style={getStyle}>Challan No.</th>
                  <th style={getStyle}>{`${
                    channelId === 43 ? "Primary Qty" : "Qty"
                  }`}</th>
                  {channelId === 43 && <th style={getStyle}>Net Qty</th>}
                  <th style={getStyle}>UoM</th>
                  <th style={{ ...getStyle, width: "90px" }}>
                    {/* Unit Price (TK/{`${channelId === 43 ? "M.T" : "Bag"}`}) */}
                    Unit Price (TK)
                  </th>
                  <th style={getStyle}>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData?.map((item, index) => {
                  totalQty += item?.quantity;
                  // totalQty += item?.totalDeliveredQtyCFT;
                  grandTotal += item?.totalAmount || 0;
                  // totalItemRate += item?.itemRate || 0;
                  totalNetQty += item?.netQty || 0;

                  return (
                    <tr>
                      <td className="text-center">{index + 1}</td>
                      <td>{item?.itemName}</td>
                      <td>{item?.orderCode}</td>
                      {/* <td>{item?.deliveryAddress}</td> */}
                      <td>{_dateFormatter(item?.deliveriDate)}</td>
                      <td>{item?.deliveryCode}</td>
                      <td className="text-right">
                        {item?.quantity}
                        {/* {_fixedPoint(item?.totalDeliveredQtyCFT, true)} */}
                      </td>
                      {channelId === 43 && (
                        <td className="text-right">{item?.netQty}</td>
                      )}
                      <td className="text-right">{item?.uom}</td>

                      <td className="text-right" style={{ width: "60px" }}>
                        {item?.itemRate}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.totalAmount, true)}
                      </td>
                    </tr>
                  );
                })}
                <tr style={{ textAlign: "right", fontWeight: "bold" }}>
                  <td colSpan={5}>Grand Total</td>
                  <td>{_fixedPoint(totalQty, true)}</td>
                  {channelId === 43 && (
                    <td>{_fixedPoint(totalNetQty, true)}</td>
                  )}
                  <td>{/* {_fixedPoint(totalItemRate, true)} */}</td>
                  <td>{_fixedPoint(grandTotal, true)}</td>
                </tr>
                <tr style={{ fontWeight: "bold", textAlign: "left" }}>
                  <td colSpan={channelId === 43 ? 10 : 9} className="text-left">
                    IN WORDS: {toWords.convert(grandTotal?.toFixed(0))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>On behalf of Akij Cement Company Ltd.</p>
          <div className="signature_wrapper">
            <div className="first signature bold">
              <p>{empName}</p>
            </div>
          </div>
          <p>{designationName}</p>
          <p>{buName}</p>
          <div style={{ marginTop: "25px" }}>
            <p>
              <b>Enclose</b>
            </p>
            <p>1. Delivery Invoice</p>
          </div>
          <div style={{ position: "relative" }}>
            <p
              style={{
                bottom: "70px",
                textAlign: "center",
                position: "fixed",
                width: "100%",
              }}
            >
              This is an automatically generated invoice, no signature is
              required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceReceptForCement;
