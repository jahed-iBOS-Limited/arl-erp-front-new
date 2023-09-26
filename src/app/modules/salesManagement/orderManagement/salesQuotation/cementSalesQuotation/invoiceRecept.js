import moment from "moment";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { _todayDate } from "../../../../_helper/_todayDate";
import "./cementStyle.css";

const SalesQuotationForCement = ({
  printRef,
  invoiceData,
  businessPartnerInfo,
}) => {
  const {
    profileData: { employeeFullName, designationName },
    selectedBusinessUnit: { imageId },
  } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  return (
    <div className="cement_quotation_print" ref={printRef}>
      <div className="header">
        <div className="office_info">
          <p>Corporate Office :Akij House, 198, Bir Uttam Mir Shawkat Sarak</p>
          <p>
            (Gulshan-Tejgaon Link Road), Tejgaon I/A, Dhaka-1208, Phone :
            09613313131, 09604313131
          </p>
          <p>Email: info@akij.net, Website: www.akijcement.com</p>
          <p>Factory Location: Nabiganj, Kadam Rasul, Narayangonj.</p>
        </div>
        <div className="logo">
          <img
            style={{ width: "230px", height: "115px", objectFit: "cover" }}
            src={`${"https://erp.ibos.io"}/domain/Document/DownlloadFile?id=${imageId}`}
            alt="logo"
          />
        </div>
      </div>

      <div className="main_table">
        <div>
          <div className="d-flex justify-content-between mb-3">
            <p>
              <b>Ref: </b>
              {invoiceData?.[0]?.partnerReffNo || ""}
            </p>
            <p>
              <b>Date: {moment(_todayDate()).format("DD MMM YYYY")}</b>
            </p>
          </div>
          <div className="bold">
            <p>To</p>
            <p>The Managing Director</p>
            <p>{businessPartnerInfo?.strBusinessPartnerName}</p>
            <p> {businessPartnerInfo?.strBusinessPartnerAddress} </p>
            {/* <p>Banani, Dhaka-1213</p> */}
          </div>

          <div className="bold my-3">
            Subject: Price Proposal from “AKIJ Cement”.
          </div>

          <div className="mb-3">
            <p>Dear Sir,</p>
            <p>
              We are pleased to offer you <b>“AKIJ”</b> Brand” Ordinary Portland
              Cement & Portland Composite Cement” in reference to your
              requirement and our discussion. In order to take advantage of our
              corporate package please finds here the best possible offer for
              you:
            </p>
          </div>
          <p className="underline">
            <b>The Product:</b>
          </p>
          <div className="mb-5">
            <div className="invoiceFooterInfo">
              <p>
                <span>Brand Name </span> <b>Akij</b>
              </p>
              <p>
                <span>Cement Type </span>
                OPC & PCC
              </p>
              <p>
                <span>Category </span>
                Portland Cement (CEM-I), Strength Class 52.5 according to BDS EN
                197-1:2003
              </p>
              <p>
                <span>Price </span>
                00
              </p>
            </div>
          </div>
        </div>

        <table className="table mb-5">
          <thead>
            <tr>
              <th rowSpan={2}>Destination</th>
              <th rowSpan={2}>Product</th>
              <th rowSpan={2}>UOM</th>
              <th rowSpan={2}>Transport type</th>
              <th colSpan={2}>Price in BDT</th>
              <th rowSpan={2}>Remark</th>
            </tr>
            <tr>
              <th>Ex-Factory</th>
              <th>Reach Price (Inclusive Transport)</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData?.map((item, index) => {
              return (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">{item?.itemName}</td>
                  <td className="text-center">{item?.uomName}</td>
                  <td className="text-center">{item?.transportType}</td>
                  <td className="text-center">{item?.numPriceWithTransport}</td>
                  <td className="text-center">{item?.itemPrice}</td>
                  <td className="text-center">{item?.remark}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <p className="underline">
          <b>Terms and Conditions:</b>
        </p>
        <div className="mb-5">
          <div className="invoiceFooterInfo">
            <p>
              <span>Mode of payment </span> Online /PO/Cheque, is to be given in
              favor of <b>“Akij cement company limited”</b>.
            </p>
            <p>
              <span>Credit Days </span>
              {invoiceData?.[0]?.intlimitdays} days from the date of delivery of
              each consignment
            </p>
            <p>
              <span>Credit backup </span>
              {invoiceData?.[0]?.paymentMode}
              {/* Purchase Order/Post Dated Cheque/Bank Guarantee/L-C. */}
            </p>
            <p>
              <span>Credit Limit </span>
              500000/1000000
            </p>
            <p>
              <span>Time of Delivery </span>
              Within 48 hours for Dhaka & 72 hours for outer Dhaka subject to
              getting PO.
            </p>
            <p>
              <span>Unloading </span>
              Maximum 30 feet from the truck.
            </p>
            <p>
              <span>Validity of offer </span>
              {invoiceData?.[0]?.validityDays} days from the date price offer
              issued.
            </p>
          </div>
        </div>
        <p className="underline">
          <b>Note:</b>
        </p>
        <div className="note">
          <ul>
            {/* <li>Rate is Including AIT & VAT (RMC not vat able item)</li> */}
            <li>
              a) In case of price revision, the work order quantity and duration
              of delivery may not be considered.
            </li>
            <li>
              b) In case of any AIT deduction, you must provide certificate
              within 40 days from the date of payment.
            </li>
            <li>
              c) ACCL retains the ultimate discretion in respect of delivery,
              time and price of any product.
            </li>
          </ul>
        </div>

        <div className="mb-5 mt-1">
          <p>
            If you have any questions or require further clarification regarding
            the quotation, please do not hesitate to contact our sales team at
            01711555015 or bashar.accl@akijcement.com. We are always available
            to assist you and discuss any specific requirements you may need.
          </p>
        </div>
        <div className="mb-5">
          <p>On behalf of Akij Cement Company Ltd.</p>
        </div>
      </div>

      {/* <p className="bold mt-2 mb-2">Thanking you,</p> */}

      {/* <div className="mt-5 pt-5 text-center">
        <p className="mt-5 pt-5">
          This is an automatically generated price quotation, no signature is
          required.
        </p>
      </div> */}
      <p className="bold mt-7"> {`(${employeeFullName})`} </p>
      <p> {designationName} </p>
      <p> Akij Cement Company Limited </p>
    </div>
  );
};

export default SalesQuotationForCement;
