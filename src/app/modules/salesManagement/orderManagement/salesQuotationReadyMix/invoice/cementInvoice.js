import React from "react";
import { shallowEqual, useSelector } from "react-redux";

const CementInvoice = ({ printRef, invoiceData, businessPartnerInfo }) => {
  const {
    selectedBusinessUnit,
    profileData: { employeeFullName, designationName },
  } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  return (
    <div className="print_invoice_wrapper" ref={printRef}>
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
            style={{ width: "255px", objectFit: "cover" }}
            src={`${window?.location?.origin}/domain/Document/DownlloadFile?id=${selectedBusinessUnit?.imageId}`}
            alt=""
          />
        </div>
      </div>
      <div className="content left-align">
        <p>Ref: 01 Date: 27 May 2024</p>
        <p>To</p>
        <p>The Managing Director</p>
        <p>REMARK HB LIMITED Baushia, Gajaria,</p>
        <p>Munshiganj-1510, Gajaria PS: Munshiganj-1510, BD</p>
        <br />
        <p>Subject: Price Proposal from “AKIJ Cement”.</p>
        <br />

        <p>Dear Sir,</p>
        <p>
          We are pleased to offer you “AKIJ” Brand Ordinary Portland Cement &
          Portland Composite Cement in reference to your requirement and our
          discussion. In order to take advantage of our corporate package please
          find here the best possible offer for you:
        </p>
        <br />
        <p style={{ textDecoration: "underline" }}>The Product:</p>
        <div className="d-flex">
          <div>
            <p>Brand Name</p>
            <p>Cement Type</p>
            <p>Category</p>
          </div>
          <div>
            <p>: Akij</p>
            <p>: OPC & PCC</p>
            <p>
              : Portland Cement (CEM-I), Strength Class 52.5 according to BDS EN
              197-1:2003
            </p>
          </div>
        </div>
        <p>
          Portland Composite Cement (CEM-II), Strength Class 42.5 according to
          BDS EN 197-1:2003
        </p>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            margin: "20px 0",
          }}
          className="table table-bordered"
        >
          <thead>
            <tr>
              <th rowSpan={2}>SL</th>
              <th rowSpan={2}>Destination</th>
              <th rowSpan={2}>Product</th>
              <th rowSpan={2}>UOM</th>
              <th rowSpan={2}>Transport type</th>
              <th colspan="2">Price in BDT</th>
              <th>Remarks</th>
            </tr>
            <tr>
              <th>RemarkEx-Factory</th>
              <th>Reach Price (Inclusive Transport)</th>
            </tr>
            <tr></tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Bausia, Gazaria, Munshigonj.</td>
              <td>Akij Cement (Bulk) PCC</td>
              <td>Ton</td>
              <td>Truck</td>
              <td></td>
              <td>495</td>
              <td></td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
      <div className="terms">
        <p style={{ textDecoration: "underline" }}>Terms and Conditions:</p>
        <div className="d-flex">
          <div>
            <p>Payment Method</p>
            <p>Credit Period</p>
            <p>Delivery Time</p>
            <p>Maximum Distance from Truck</p>
            <p>Validity</p>
          </div>
          <div>
            <p>
              : Online / PO / Cheque, in favor of “Akij cement company limited”.
            </p>
            <p>: 30 days from the date of delivery of each consignment.</p>
            <p>
              : Within 48 hours for Dhaka & 72 hours for outer Dhaka, subject to
              getting PO.
            </p>
            <p>: Maximum 30 feet from the truck.</p>
            <p>: 7 days from the date the price offer is issued.</p>
          </div>
        </div>
      </div>
      <div>
        <br />
        <p style={{ textDecoration: "underline" }}>Notice</p>
        <div className="ml-3">
          <p>
            a) In case of price revision, the work order quantity and duration
            of delivery may not be considered.
          </p>
          <p>
            b) In case of any AIT deduction, you must provide certificate within
            30 days from the date of payment
          </p>
          <p>
            c) ACCL retains the ultimate discretion in respect of delivery, time
            and price of any product.
          </p>
        </div>
      </div>
      <p>
        If you have any questions or require further clarification regarding the
        quotation, please do not hesitate to contact our sales team at
        01711555015 or bashar.accl@akijcement.com. We are always available to
        assist you and discuss any specific requirements you may need.
      </p>
      <br />
      <br />
      <p>On behalf of Akij Cement Company Ltd.</p>
      <br />
      <br />
      <div className="d-flex justify-content-between">
        <div>
          <p>Prepared By</p>
          <p>{employeeFullName}</p>
          <p>{designationName}</p>
          <p>Akij Cement Company Limited</p>
        </div>
        <p>Received By</p>
      </div>
      <br />

      <p className="text-center mt-4">
        This is an automatically generated price quotation, no signature is
        required
      </p>
    </div>
  );
};

export default CementInvoice;
