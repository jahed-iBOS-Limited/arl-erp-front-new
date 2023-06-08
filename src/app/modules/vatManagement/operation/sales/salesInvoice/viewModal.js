import React, { useRef, useState, useEffect } from "react";
import printIcon from "./../../../../_helper/images/print-icon.png";
import ReactToPrint from "react-to-print";
import IViewModal from "./../../../../_helper/_viewModal";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import "./style.css";
import { useSelector, shallowEqual } from "react-redux";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";
import moment from "moment";
import {
  EditTaxSalesInvoicePrintStatus_api,
  GetTaxSalesInvoicePrintStatus_api,
  getSalesInvoiceById,
  GetSalesLogDetails_api,
} from "./helper";
const tableTitles = [
  "SL",
  "Item Name",
  "UOM",
  "Quantity",
  "Rate(Taka)",
  "Total Value(Taka",
  "SD %",
  "SD Amount",
  "VAT%/Fixed",
  "VAT Amount",
  "Total including VAT&SD",
];
export default function SalesInvoiceModel({
  show,
  onHide,
  viewClick,
  redirectAuditLogPage,
}) {
  const [singleData, setSingleData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isPrintBtnClick, setisPrintBtnClick] = useState(false);
  const [salesInvoicePrintStatus, setSalesInvoicePrintStatus] = useState(false);
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      // selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData } = storeData;
  const printRef = useRef();
  const cb = (id) => {
    GetTaxSalesInvoicePrintStatus_api(id, setSalesInvoicePrintStatus);
  };

  let actualQty = 0;
  let totalwithoutTax = 0;
  let amountofSD = 0;
  let amountofVAT = 0;
  let totalPrice = 0;
  useEffect(() => {
    if (viewClick?.taxSalesId || redirectAuditLogPage?.logId) {
      if (redirectAuditLogPage?.logId) {
        GetSalesLogDetails_api(
          redirectAuditLogPage?.logId,
          setSingleData,
          setLoading
        );
      } else {
        getSalesInvoiceById(viewClick?.taxSalesId, setSingleData, setLoading);
        GetTaxSalesInvoicePrintStatus_api(
          viewClick?.taxSalesId,
          setSalesInvoicePrintStatus
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewClick]);

  return (
    <div>
      <IViewModal
        show={show}
        onHide={() => {
          onHide();
          setSingleData("");
        }}
        title={"Sales Invoice"}
        btnText="Close"
        componentRef={printRef}
        isShow={loading}
      >
        {redirectAuditLogPage?.logId && (
          <div className="mt-8">
            <p className="p-0 m-0">
              <b>Activity</b>: {singleData?.auditLog?.activity}{" "}
            </p>
            <p className="p-0 m-0">
              <b>Action Date/Time</b>:{" "}
              {moment(singleData?.auditLog?.activityTime).format(
                "DD-MMM-YY, LTS"
              )}
            </p>
          </div>
        )}

        <div className="printDif mx-10 mr-15" ref={printRef}>
          {salesInvoicePrintStatus && <p className="duplicatePrint">Copy</p>}
          <div className="row sales-invoice-model  m-0">
            <div className="col-lg-2 offset-10 d-flex justify-content-end">
              <span
                onClick={() => {
                  setisPrintBtnClick(true);
                  EditTaxSalesInvoicePrintStatus_api(viewClick?.taxSalesId, cb);
                }}
              >
                <ReactToPrint
                  onAfterPrint={() => {
                    setisPrintBtnClick(false);
                  }}
                  onBeforePrint={() => {
                    setisPrintBtnClick(true);
                  }}
                  trigger={() => (
                    <button
                      type="button"
                      className="btn btn-primary sales_invoice_btn"
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
                  pageStyle={
                    "@media print{body { -webkit-print-color-adjust: exact;padding: 0 40px; }@page {size: portrait ! important; margin 100px ! important;}}"
                  }
                />
              </span>
            </div>
            {salesInvoicePrintStatus && <p className="">Copy</p>}
            <div className="col-lg-12 p-0">
              <div className="title text-center mt-5">
                <div className="top">
                  <div
                    className="d-flex justify-content-end"
                    style={{ marginBottom: "-35px", marginRight: "50px" }}
                  >
                    <span
                      style={{ border: "1px solid gray", fontSize: 18 }}
                      className="p-2"
                    >
                      <strong>Mushak-6.3</strong>
                    </span>
                  </div>
                  <h1>
                    <b>Government of the People's Republic of Bangladesh</b>
                  </h1>
                  <h5>
                    <b>National Board of Revenue</b>
                  </h5>
                </div>

                <div className="buttom">
                  <h5 className="mt-3">
                    <b>Tax Challan</b>
                  </h5>
                  <p>
                    <b>[See Clauses (C) and (f) of Sub-Rule (1) of Rule 40]</b>
                  </p>
                  <p>
                    <strong>
                      Name of Registered Person:{" "}
                      {singleData?.objHeader?.businessUnitName}
                    </strong>
                  </p>
                  <p>
                    <strong>
                      BIN of Registered Person:{" "}
                      {singleData?.objHeader?.companyBin}
                    </strong>
                  </p>

                  <p>
                    <strong>
                      Challan Issuing Address:{" "}
                      {singleData?.objHeader?.taxBranchAddress}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-12 p-0">
              <div className="d-flex justify-content-between">
                <div className="left" style={{ width: "715px" }}>
                  <p>
                    <b>
                      Customer Name: {singleData?.objHeader?.soldtoPartnerName}
                    </b>
                  </p>
                  <p>
                    <b>Customer BIN: {singleData?.objHeader?.binNo}</b>
                  </p>
                  <p>
                    <strong>
                      Customer Address:{" "}
                      {singleData?.objHeader?.soldtoPartnerAddress}
                    </strong>
                  </p>
                  <p>
                    <b>
                      Final Destination:{" "}
                      {singleData?.objHeader?.shiptoPartnerAddress}
                    </b>
                  </p>
                  <p>
                    <strong>
                      Driver Name: {singleData?.objHeader?.driverName || ""}
                    </strong>
                  </p>
                </div>
                <div className="right">
                  <p>
                    <b>Invoice No: {singleData?.objHeader?.taxSalesCode}</b>
                  </p>
                  <p>
                    <b>
                      Date of Issue:{" "}
                      {singleData?.objHeader?.deliveryDateTime &&
                        _dateFormatter(
                          isPrintBtnClick
                            ? new Date()
                            : singleData?.objHeader?.deliveryDateTime
                        )}
                    </b>
                  </p>
                  <p>
                    <b>
                      Time of Issue:{" "}
                      {moment(
                        isPrintBtnClick
                          ? new Date()
                          : singleData?.objHeader?.taxDeliveryDateTime
                      ).format("LTS")}
                    </b>
                  </p>
                  <p>
                    <strong>
                      Vehicle No: {singleData?.objHeader?.vehicleNo}
                    </strong>
                  </p>

                  <p>
                    <strong>
                      Driver Contact No:{" "}
                      {singleData?.objHeader?.driverContact || ""}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-12 p-0">
              <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr className="vendorListHeading">
                    {tableTitles.map((th, index) => {
                      return (
                        <th style={{ padding: "0 !important" }} key={index}>
                          <div
                            style={{
                              height: "100%",
                              display: "block",
                              background: "#d6dadd",
                              padding: "10px 0",
                              fontWeight: "900",
                            }}
                          >
                            {th}
                          </div>
                        </th>
                        // <th> {th} </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {singleData?.objList?.map((itm, i) => {
                    const vatPersent =
                      (itm?.vatTotal / (itm?.grandTotal - itm?.vatTotal)) * 100;
                    const sdPersent =
                      (itm?.sdtotal /
                        (itm?.grandTotal - itm?.vatTotal - itm?.sdtotal)) *
                      100;
                    actualQty += itm?.quantity;
                    totalwithoutTax += itm?.baseTotal;
                    amountofSD += itm?.sdtotal;
                    amountofVAT += itm?.vatTotal;
                    totalPrice += itm?.grandTotal;
                    return (
                      <tr key={i}>
                        <td className="text-center">
                          {" "}
                          <b>{i + 1}</b>
                        </td>
                        <td className="text-center">
                          <b>{itm?.taxItemGroupName}</b>
                        </td>
                        <td className="text-center">
                          {" "}
                          <b>{itm?.uomname}</b>
                        </td>
                        <td className="text-center">
                          {" "}
                          <b>{_fixedPoint(itm?.quantity)}</b>
                        </td>
                        <td className="text-center">
                          {" "}
                          <b>{_fixedPoint(itm?.basePrice)}</b>
                        </td>
                        <td className="text-center">
                          {" "}
                          <b>{_fixedPoint(itm?.baseTotal)}</b>
                        </td>
                        {/* <td className="text-center"> {itm?.sdtotal}</td> */}
                        <td className="text-center">
                          <b>{`${_fixedPoint(sdPersent)}%`}</b>
                        </td>
                        <td className="text-center">
                          {" "}
                          <b>{_fixedPoint(itm?.sdtotal)}</b>
                        </td>
                        <td className="text-center">
                          <b>{`${_fixedPoint(vatPersent)}%`}</b>
                        </td>
                        <td className="text-center">
                          {" "}
                          <b>{_fixedPoint(itm?.vatTotal)}</b>
                        </td>
                        <td className="text-center">
                          {" "}
                          <b>{_fixedPoint(itm?.grandTotal)}</b>
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan="3">
                      <b>Total:</b>{" "}
                    </td>
                    <td className="text-center">
                      {" "}
                      <b>{_fixedPoint(actualQty)}</b>{" "}
                    </td>
                    <td></td>
                    <td className="text-center">
                      <b>{_fixedPoint(totalwithoutTax)}</b>{" "}
                    </td>
                    <td> </td>
                    <td className="text-center">
                      <b>{_fixedPoint(amountofSD)}</b>{" "}
                    </td>
                    <td> </td>
                    <td className="text-center">
                      <b>{_fixedPoint(amountofVAT)}</b>{" "}
                    </td>
                    <td className="text-center">
                      <b>{_fixedPoint(totalPrice)}</b>{" "}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="row footer_buttom  mt-10 taxSalesModelFooter">
            <div className="col-lg-12 p-0">
              <div
                className="d-flex justify-content-between px-5"
                style={{ marginTop: "30px" }}
              >
                <div>
                  {singleData?.objHeader?.tradeTypeId !== 5 && (
                    <p>
                      <strong>Zero Rated Vat</strong>
                    </p>
                  )}
                  <p>
                    <b>
                      Name of organization Officer-in-charge:{" "}
                      {profileData?.userName}
                    </b>
                  </p>
                  <p>
                    <b>Designation: {profileData?.designationName}</b>
                  </p>
                </div>
                <p style={{ borderTop: "1px solid" }}>
                  <b>Signature</b>{" "}
                </p>
                <p style={{ borderTop: "1px solid" }}>
                  <b>Driver Signature</b>
                </p>
                <p style={{ borderTop: "1px solid" }}>
                  <b>Receiver Signature</b>
                </p>
              </div>
              {/* <p className="mt-1 px-5">
                <strong>1. Value except all kinds of Tax.</strong>
              </p> */}
            </div>
          </div>
        </div>
      </IViewModal>
    </div>
  );
}
