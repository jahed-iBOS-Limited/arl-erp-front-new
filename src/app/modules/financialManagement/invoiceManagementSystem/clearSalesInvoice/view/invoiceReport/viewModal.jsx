import React, { useEffect, useRef, useState } from "react";
import ISpinner from "./../../../../../_helper/_spinner";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import printIcon from "../../../../../_helper/images/print-icon.png";
// import { toast } from "react-toastify";
// import IDelete from "./../../../../../_helper/_helperIcons/_delete";
import Loading from "./../../../../../_helper/_loading";
import { getInvoiceReportData } from "../../helper";
import ReactToPrint from "react-to-print";
import InvoiceTableBlueHeader from "./invoiceTable";

export default function InvoiceReportTable({
  id,
  show,
  onHide,
  isShow,
  item,
  gridDataFunc,
  parentFormValues,
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);

  let { profileData, selectedBusinessUnit } = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
      };
    },
    { shallowEqual }
  );

  useEffect(() => {
    if (show) {
      getInvoiceReportData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        item?.invoiceCode,
        setInvoiceData,
        setDisabled
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const printRef = useRef();

  const subTotal  = invoiceData?.row?.reduce(
    (acc, cur) => acc + cur?.total,
    0
  )
  return (
    <div className="clear_sales_invoice_View_Form">
      <div className="viewModal">
        <Modal
          show={show}
          onHide={onHide}
          size="xl"
          aria-labelledby="example-modal-sizes-title-xl"
          className="clear_sales_invoice_View_Form"
        >
          {isDisabled && <Loading />}
          {isShow ? (
            <ISpinner isShow={isShow} />
          ) : (
            <>
              <Modal.Header className="bg-custom">
                <Modal.Title className="w-100">
                  <div className="d-flex justify-content-between px-4 py-2">
                    <div className="title">{"Invoice Report"}</div>
                    <div className="mt-5">
                      <ReactToPrint
                        pageStyle={
                          "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}"
                        }
                        trigger={() => (
                          <button
                            type="button"
                            className="btn btn-primary printSectionNone"
                            style={{
                              padding: "2px 5px",
                              position: "absolute",
                              top: "5px",
                              right: "5px",
                            }}
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
                  </div>
                </Modal.Title>
              </Modal.Header>

              <Modal.Body
                id="example-modal-sizes-title-xl "
                ref={printRef}
                className="clearsalesinvBillWrapper mt-6"
              >
                <div className="d-flex justify-content-between">
                  <div>
                    <h4>Company Name: {invoiceData?.companyName}</h4>
                    <h6>Address: {invoiceData?.city}</h6>
                    <h6>Phone: 01703-596292</h6>
                    <h6>Website: www.ibos.io</h6>
                  </div>
                  <div>
                    <h1 style={{ color: "#7791c9" }}>INVOICE</h1>
                    <h6>Date: {item?.transactionDate}</h6>
                    <h6>Invoice No: {item?.invoiceCode.split("-")[1]}</h6>
                    <h6>Customer Id: {item?.accountReceivablePayableId}</h6>
                  </div>
                </div>
                <div className="d-flex">
                  <div style={{ width: "300px" }} className="mr-6">
                    <InvoiceTableBlueHeader ths={["Bill To"]}>
                      <tr>
                        <td className="text-left">
                          Name: {invoiceData?.getInvoiceBillSoldTo?.billToName}
                          <br />
                          Company Name:{" "}
                          {invoiceData?.getInvoiceBillSoldTo?.billToCompanyName}
                          <br />
                          Street Address:{" "}
                          {invoiceData?.getInvoiceBillSoldTo?.billTOAddress}
                          <br />
                          Phone:{" "}
                          {invoiceData?.getInvoiceBillSoldTo?.billToPhone}
                        </td>
                      </tr>
                    </InvoiceTableBlueHeader>
                  </div>
                  <div className="ml-6" style={{ width: "300px" }}>
                    <InvoiceTableBlueHeader ths={["Ship To"]}>
                      <tr>
                        <td className="text-left">
                          Name: {invoiceData?.getInvoiceBillSoldTo?.soldToName}
                          <br />
                          Company Name:
                          {
                            invoiceData?.getInvoiceBillSoldTo?.soldToCompanyName
                          }{" "}
                          <br />
                          Street Address:
                          {
                            invoiceData?.getInvoiceBillSoldTo?.soldTOAddress
                          }{" "}
                          <br />
                          Phone:
                          {invoiceData?.getInvoiceBillSoldTo?.soldToPhone}
                        </td>
                      </tr>
                    </InvoiceTableBlueHeader>
                  </div>
                </div>
                <div>
                  <InvoiceTableBlueHeader
                    ths={[
                      "SALES PERSON",
                      "PO #",
                      "SHIP DATE",
                      "SHIP VIA",
                      "F.O.B.",
                      "TERM S",
                    ]}
                  >
                    <tr>
                      <td> {" ."}</td>
                      <td> {" ."}</td>
                      <td> {" ."}</td>
                      <td> {" ."}</td>
                      <td> {" ."}</td>
                      <td> {" ."}</td>
                    </tr>
                  </InvoiceTableBlueHeader>
                </div>
                <div>
                  <div
                    className="react-bootstrap-table table-responsive"
                    id="blue-table"
                  >
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th
                            className="blue-table"
                            style={{ color: "white", width: "30px" }}
                          >
                            Sl
                          </th>
                          <th
                            className="blue-table"
                            style={{ color: "white", width: "100px" }}
                          >
                            Item
                          </th>
                          <th
                            className="blue-table"
                            style={{ color: "white", width: "500px" }}
                          >
                            Description
                          </th>
                          <th
                            className="blue-table"
                            style={{ color: "white", width: "150px" }}
                          >
                            Quantity
                          </th>
                          <th
                            className="blue-table"
                            style={{ color: "white", width: "150px" }}
                          >
                            Unit Price
                          </th>
                          <th
                            className="blue-table"
                            style={{ color: "white", width: "150px" }}
                          >
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceData?.row?.length > 0 &&
                          invoiceData?.row?.map((data, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{data?.itemId}</td>
                              <td>{data?.description}</td>
                              <td className="text-center">{data?.quantity}</td>
                              <td className="text-right">{data?.unitPrice}</td>
                              <td className="text-right">{data?.total}</td>
                            </tr>
                          ))}
                        <tr>
                          <td colSpan="4"></td>
                          <td>
                            <b>Sub Total</b>
                          </td>
                          <td className="text-right">
                            <b>
                             {subTotal}
                            </b>
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan="3"
                            className="text-left"
                            style={{
                              backgroundColor: "#3b4e87",
                              borderBottom: "none",
                            }}
                          >
                            <div className="whiteColor">
                              <style>
                                {`@media print,screen {.whiteColor{color:#fff;background-color:#3b4e87}}`}
                              </style>
                              Other Comments Or special Instruction
                            </div>
                          </td>
                          <td></td>
                          <td >
                            <b>TAX Rate</b>
                          </td>
                          <td className="text-right">
                            <b>{invoiceData?.taxRate}</b>
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan="3"
                            className="text-left"
                            style={{
                              backgroundColor: "#transparent",
                              borderTop: "none",
                              borderBottom: "none",
                            }}
                          >
                            1. Total payment due in 30 days
                          </td>
                          <td></td>
                          <td>
                            <b>Total TAX</b>
                          </td>
                          <td className="text-right">
                            <b>{invoiceData?.tax}</b>
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan="3"
                            className="text-left"
                            style={{
                              backgroundColor: "transparent",
                              borderTop: "none",
                            }}
                          >
                            2. Please include the invoke number in check
                          </td>
                          <td></td>
                          <td>
                            <b>Other</b>
                          </td>
                          <td className="text-right">-</td>
                        </tr>
                        <tr>
                          <td colSpan="3"></td>
                          <td></td>
                          <td>
                            <b>Total</b>{" "}
                          </td>
                          <td className="text-right">
                            <b>{subTotal + invoiceData?.tax}</b>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="4"></td>
                          <td colSpan="3" className="text-center">
                            Make all checks payable to your{" "}
                            {invoiceData?.companyName}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="text-center mt-5">
                  <h5>
                    If you have any questions about this invoke, please contact
                    Admin, info@ibos.io, 01703-596292
                  </h5>
                  <h4>Thank you for business!</h4>
                </div>
              </Modal.Body>
              <Modal.Footer>
                {/* <div>
                          <button
                            type="button"
                            onClick={() => {
                              onHide();
                              // setRowDto([]);
                              setFieldValue("balanceAmount", "");
                            }}
                            className="btn btn-light btn-elevate"
                          >
                            Cancel
                          </button>
                          <> </>
                        </div> */}
              </Modal.Footer>
            </>
          )}
        </Modal>
      </div>
    </div>
  );
}
