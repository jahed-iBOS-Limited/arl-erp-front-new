import React from "react";
import "./InvoiceRecept.css";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { ToWords } from "to-words";
import { shallowEqual, useSelector } from "react-redux";
import cement_header from "../../../../_helper/images/cement_header.svg";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

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
    selectedBusinessUnit: { label: buName },
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

  return (
    <div className="print_invoice_wrapper_cement" ref={printRef}>
      <div className="header">
        <img src={cement_header} alt="logo" width={"100%"} />
        {/* <div style={{ display: 'flex' }}>
          <img src={logo} alt="logo" />
          <div className="office_info ml-2" style={{ color: '' }}>
            <p style={{ color: 'rgb(75, 25, 176)', marginBottom: '0' }}>
              আকিজ সিমেন্ট কোম্পানী লিঃ
            </p>
            <p style={{ color: 'rgb(75, 25, 176)', marginBottom: '0' }}>
              AKIJ CEMENT COMPANY LTD
            </p>
          </div>
        </div>

        <div>
          <p style={{ color: 'rgb(75, 25, 176)', marginBottom: '0' }}>
            Akij House, 198 Bir Uttam Mir Shawkat Sarak <br /> (Gulshan Link
            Road), Tejgaon, Dhaka-1208 <br />
            Phone: 09613313131, 09604313131 <br />
            Factory: Nabiganj, Kadam Rasul, Narayangonj.
          </p>
        </div> */}
      </div>
      <div
        style={{
          textAlign: "center",
          marginBottom: "10px",
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
            Invoice {invoiceData[0]?.strInvoiceNo}
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
              <th style={getStyle}>Delivery Order</th>
              {/* <th style={getStyle}>Destination</th> */}
              <th style={{ width: "90px", ...getStyle }}>Delivery Date</th>
              <th style={getStyle}>Challan No.</th>
              <th style={getStyle}>{`${
                channelId === 43 ? "Primary Qty" : "Qty (Bag)"
              }`}</th>
              {channelId === 43 && <th style={getStyle}>Net Qty</th>}
              <th style={{ ...getStyle, width: "90px" }}>
                Unit Price (TK/Bag)
              </th>
              <th style={getStyle}>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData?.map((item, index) => {
              totalQty += item?.totalDeliveredQtyCFT;
              grandTotal += item?.totalAmount || 0;
              // totalItemRate += item?.itemRate || 0;
              totalNetQty += item?.actualDeliveryQty || 0;

              return (
                <tr>
                  <td className="text-center">{index + 1}</td>
                  <td>{item?.itemName}</td>
                  <td>{item?.orderCode}</td>
                  {/* <td>{item?.deliveryAddress}</td> */}
                  <td>{_dateFormatter(item?.deliveriDate)}</td>
                  <td>{item?.deliveryCode}</td>
                  <td className="text-right">
                    {_fixedPoint(item?.totalDeliveredQtyCFT, true)}
                  </td>
                  {channelId === 43 && (
                    <td className="text-right">
                      {_fixedPoint(item?.actualDeliveryQty, true)}
                    </td>
                  )}
                  <td className="text-right" style={{ width: "60px" }}>
                    {_fixedPoint(item?.itemRate, true)}
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
              {channelId === 43 && <td>{_fixedPoint(totalNetQty, true)}</td>}
              <td>{/* {_fixedPoint(totalItemRate, true)} */}</td>
              <td>{_fixedPoint(grandTotal, true)}</td>
            </tr>
            <tr style={{ fontWeight: "bold" }}>
              <td colSpan={channelId === 43 ? 10 : 9}>
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
    </div>
  );
};

export default InvoiceReceptForCement;
