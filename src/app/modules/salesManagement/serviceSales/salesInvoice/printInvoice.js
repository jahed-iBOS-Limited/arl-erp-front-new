import React, { useEffect, useRef } from "react";
import "./style.css";
import ReactToPrint from "react-to-print";
import printIcon from "../../../_helper/images/print-icon.png";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../_helper/_loading";
import { shallowEqual, useSelector } from "react-redux";
import { _dateFormatter } from "../../../_helper/_dateFormate";

const PrintInvoiceModal = ({ singleItem }) => {
  console.log("singleItem", singleItem);
  const printRef = useRef();
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [printData, getPrintData, loader] = useAxiosGet();

  useEffect(() => {
    getPrintData(
      `/oms/ServiceSales/GetServiceSalesInvocieById?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&serviceSalesInvoiceId=${singleItem?.invocieHeader?.intServiceSalesInvoiceId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleItem]);

  return (
    <>
      {loader && <Loading />}
      <div className="text-right mt-4 mb-8">
        <ReactToPrint
          pageStyle={
            "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
          }
          trigger={() => (
            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: "2px 5px" }}
            >
              <img
                style={{
                  width: "25px",
                  paddingRight: "5px",
                }}
                src={printIcon}
                alt="print-icon"
              />
              Print
            </button>
          )}
          content={() => printRef.current}
        />
      </div>
      <div
        componentRef={printRef}
        ref={printRef}
        className="print-invoice-wrapper"
      >
        <div className="container">
          <img className="logo" src="assets/logo192.png" alt="iBOS Ltd" />
          <div className="info">
            <h2 className="info_item info_name ">iBOS SOFTWARE LTD.</h2>
            <h4 className="info_item info_address ">Kazi Nazrul Islam Road</h4>
            <h3 className="info_item info_invoice ">INVOICE</h3>
          </div>
          <div></div>
          <div className="invoice_info">
            <div className="invoice_info__item">
              <p>
                Invoice No:{" "}
                {printData[0]?.invocieHeader?.strServiceSalesInvoiceCode}
              </p>
              <p>Order No : ORD202309018 </p>
            </div>
            <div className="invoice_info__item">
              <p>
                Invoice Date:{" "}
                {_dateFormatter(
                  printData[0]?.invocieHeader?.dteInvoiceDateTime
                )}
              </p>
              <p>Order Date : 15-Oct-2023</p>
            </div>
          </div>
          <div className="address">
            <div className="address_billing">
              <p className="address_title">BILLING ADDRESS</p>
              <p className="address_buyer">
                Buyer Name: {printData[0]?.invocieHeader?.strCustomerName}
              </p>
              <p className="address_text">
                Buyer Address: {printData[0]?.invocieHeader?.strCustomerAddress}
              </p>
            </div>
            <div className="address_shipping">
              <p className="address_title"> SHIPPING ADDRESS</p>
              <p className="address_buyer">
                Buyer Name: {printData[0]?.invocieHeader?.strCustomerName}
              </p>
              <p className="address_text">
                Buyer Address:{" "}
                {printData[0]?.invocieHeader?.strCustomerAddress2}
              </p>
              <p>Contact Person: </p>
              <p>Contact Number: </p>
            </div>
          </div>
          <div>
            <table>
              <thead>
                <tr>
                  <th>SL No</th>
                  <th>Item Name</th>
                  <th>UoM</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Salaes Amount</th>
                  <th>Schedule Amount</th>
                </tr>
              </thead>
              <tbody>
                {printData[0]?.invocieRow?.length > 0 &&
                  printData[0]?.invocieRow?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.strItemName}</td>
                      <td>{item?.strUom}</td>
                      <td>{item?.numSalesQty}</td>
                      <td>{item?.numRate}</td>
                      <td>{item?.numNetSalesAmount}</td>
                      <td>{item?.numScheduleAmount}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {/* <div className="taka-in-words">
            Words: Three Thousand One Hundred Fifty Taka Only{" "}
          </div> */}
          <div className="bank_details">
            <div className="bd_item">
              <h5 className="bd_title">Bank Details:</h5>
              <p>A/C Name: </p>
              <p>A/C Number: </p>
              <p>Bank Name: </p>
              <p>Bank Branch: </p>
              <p>Routing Number: </p>
            </div>
            <div className="bd_item">
              <h5 className="bd_title">Note:</h5>
              <ul>
                <li>Bill for the month of September, 2023</li>
                <li>Bill for the month of September, 2023</li>
              </ul>
            </div>
          </div>
          <div className="signature">
            <p>Authorized Signature</p>
            <p>Receiver's Signature</p>
          </div>
          <ul className="contact">
            Contact Us -<i className="fa-solid fa-location-dot"></i>
            <li>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 384 512"
                >
                  <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                </svg>
              </span>{" "}
              6/2 Kazi Nazrul Islam Rd, Lalmatia, Mohammadpur, Dhaka-1207
            </li>
            <li>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 192 512"
                >
                  <path d="M48 80a48 48 0 1 1 96 0A48 48 0 1 1 48 80zM0 224c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V448h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H64V256H32c-17.7 0-32-14.3-32-32z" />
                </svg>
              </span>
              info@ibos.io
            </li>
            <li>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 512 512"
                >
                  <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
                </svg>
              </span>
              0135888588 (Sales)
            </li>
            <li>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 512 512"
                >
                  <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
                </svg>
              </span>
              0152028885 (Sales)
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default PrintInvoiceModal;
