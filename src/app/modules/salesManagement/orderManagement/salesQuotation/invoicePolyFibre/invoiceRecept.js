import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import "./polyStyle.css";
import { _todayDate } from "../../../../_helper/_todayDate";
import moment from "moment";
import logo from "../../../../_helper/images/apfil.svg";

const SalesQuotationForPolyFibreInvoice = ({
  printRef,
  invoiceData,
  businessPartnerInfo,
}) => {
  console.log(invoiceData, businessPartnerInfo, "print");
  const {
    profileData: { employeeFullName, designationName },
  } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  return (
    <div className="poly_fibre_quotation_print" ref={printRef}>
      <div className="poly_header text-center">
        <img style={{ height: "90px" }} src={logo} alt="logo" />
        <div className="  ml-2">
          <p
            style={{ marginBottom: "0", fontSize: "50px", fontWeight: "bold" }}
          >
            Akij Poly Fibre Industries Limited
          </p>
        </div>
        <p style={{ marginBottom: "0", fontSize: "16px" }}>
          Akij House, 198, Bir Uttam Mir Shawkat Sarak, Gulshan Link Road,
          Tejgaon I/A, Dhaka-1208 <br />
          Phone: 09613313131, 09604313131 Hotline: 16609 <br />
          <span style={{ letterSpacing: "-0.5px" }}>
            Factory: Nabiganj, Kadam Rasul, Narayangonj, Phone: 7661224, Fax:
            0088-9572292, E-mail: info@akij.net
          </span>
        </p>
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
            Subject: Quotation for WPP Laminated Bag
          </div>

          <div className="mb-3">
            <p>Dear Sir,</p>
            <p>
              Referring your requirement & discussion with you; we are offering
              the best competitive price for WPP Laminated Bag as follows.
            </p>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table mb-5">
            <thead>
              <tr>
                <th>SL</th>
                <th>Item</th>
                {/* <th>Size</th>
              <th>Weight</th> */}
                <th>Specification</th>
                <th>Unit Price (TK) Per Pcs</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData?.map((item, index) => {
                return (
                  <tr>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-left">{item?.itemName}</td>
                    <td className="text-center">
                      {item?.specification || "N/A"}
                    </td>
                    <td className="text-center">{item?.itemPrice}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mb-5 mt-5">
          <div className="invoiceFooterInfo">
            <p>
              <span>Stitching </span> {invoiceData?.[0]?.strUsesOfCement}
            </p>
            <p>
              <span>Print : </span>
              Printed (One side).
            </p>
            <p>
              <span>Bag Color </span>
              {invoiceData?.[0]?.strCoraseAggregate}
            </p>
            <p>
              <span>Packing </span>
              {invoiceData?.[0]?.strFineAggregate}
            </p>
            <p>
              <span>Payment </span>
              {invoiceData?.[0]?.paymentMode}
            </p>
            <p>
              <span>Offer Validity </span>
              {moment(invoiceData?.[0]?.quotationEndDate).format("DD MMM YYYY")}
            </p>
            <p>
              <span>Offer Quantity </span>
              <b>
                {invoiceData?.reduce(
                  (acc, cur) => acc + (+cur?.quotationQuantity || 0),
                  0
                )}{" "}
              </b>
              Pcs
            </p>
          </div>
        </div>

        <div className="mb-5">
          <p>
            We will highly appreciate to receive your kind response at the
            earliest.
          </p>
        </div>
      </div>

      <p className="bold mt-2 mb-2">Thanking you,</p>

      <p className="bold mt-7"> {employeeFullName} </p>
      <p className="bold"> {designationName} </p>
    </div>
  );
};

export default SalesQuotationForPolyFibreInvoice;
