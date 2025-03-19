import React, { useRef } from "react";
import IViewModal from "./../../../_helper/_viewModal";
import printIcon from "./../../../_helper/images/print-icon.png";
import ReactToPrint from "react-to-print";
import { _dateFormatter } from "./../../../_helper/_dateFormate";

const tableTitles = [
  "S.L No",
  "Goods/Service Description(Incases with Brand Name)",
  "Unit of Supply",
  "Quantity",
  "Unit of Value 1 (TAKA)",
  "Total Value 1 (TAKA)",
  "Amount Supplementry Duty (TAKA)",
  "Value Added Tax rate/Specifle Tax",
  "Value Added Tax rate/Speecific Tax Amount (TAKA)",
  "Value All Kinds of Duty & Tax",
];

export default function SalesInvoiceModel({
  id,
  show,
  onHide,
  rowDto,
  singleData,
}) {
  const printRef = useRef();

  return (
    <div>
      <IViewModal
        show={show}
        onHide={onHide}
        title={"Sales Invoice iBOS"}
        btnText="Close"
        componentRef={printRef}
      >
        <div
          className="sales-invoice-model_top sales-invoice-model-print"
          ref={printRef}
        >
          <div className="row sales-invoice-model m-0">
            <div className="col-lg-2 offset-10 d-flex justify-content-end">
              <ReactToPrint
                trigger={() => (
                  <button
                    type="button"
                    className="btn btn-primary sales_invoice_btn"
                  >
                    <img
                      style={{ width: "25px", paddingRight: "5px" }}
                      src={printIcon}
                      alt="print-icon"
                    />
                    Print
                  </button>
                )}
                content={() => printRef.current}
              />
            </div>
            <div className="col-lg-12 p-0">
              <div className="title text-center mt-5">
                <div className="top">
                  <h1>Government of the People's Republic of Bangladesh</h1>
                  <h5>National Board of Revenue</h5>
                </div>

                <div className="buttom">
                  <h5 className="mt-3">Tax Challan</h5>
                  <p>[See Clauses (C) and (f) of Sub-Rule (1) of Rule 40]</p>
                  <p>Name of Registered Person:</p>
                  <p>BIN of Registered Person:</p>
                  <p>Challan Issuing Address:</p>
                </div>
              </div>
            </div>
            <div className="col-lg-12 p-0">
              <div className="d-flex justify-content-between">
                <div className="left">
                  <p>
                    <b>Name of Purchaser: </b>{" "}
                    {singleData?.objHeader?.soldtoPartnerName}
                  </p>
                  <p>
                    <b>BIN of Purchaser: </b>{" "}
                    {singleData?.objHeader?.partnerBin}
                  </p>
                  <p>
                    <b>Destination of Supply: </b>{" "}
                    {singleData?.objHeader?.shiptoPartnerAddress}{" "}
                  </p>
                </div>
                <div className="right">
                  <p>
                    <b>Invoice No: </b> {singleData?.objHeader?.taxSalesCode}
                  </p>
                  <p>
                    <b>Date of Issue: </b>{" "}
                    {_dateFormatter(singleData?.objHeader?.deliveryDateTime)}{" "}
                  </p>
                  <p>
                    <b>Time of Issue: </b>{" "}
                    {singleData?.objHeader?.taxDeliveryDateTime}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-12 p-0 table-responsive">
              <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr className="vendorListHeading">
                    {tableTitles?.map((th, index) => {
                      return (
                        <th
                          style={{ height: "34px", padding: "0 !important" }}
                          key={index}
                        >
                          <div
                            style={{
                              height: "100%",
                              display: "block",
                              background: "#d6dadd",
                              padding: "0",
                            }}
                          >
                            {th}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {rowDto.map((itm, i) => {
                    return (
                      <tr key={i}>
                        <td className="text-center"> {i + 1}</td>
                        <td className="text-center">
                          {" "}
                          {itm?.taxItemGroupName}
                        </td>
                        <td className="text-center"> {itm?.uomname}</td>
                        <td className="text-center"> {itm?.quantity}</td>
                        <td className="text-center"> {itm?.basePrice}</td>
                        <td className="text-center"> {itm?.baseTotal}</td>
                        <td className="text-center"> {itm?.sdtotal}</td>
                        <td className="text-center"> {itm?.subTotal}</td>
                        <td className="text-center"> {itm?.surchargeTotal}</td>
                        <td className="text-center"> {itm?.grandTotal}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="row footer_buttom  mt-5 ">
            <div className="col-lg-12 p-0">
              <div
                className="d-flex justify-content-between px-5"
                style={{ marginTop: "30px" }}
              >
                <div>
                  <p>Name of organization Officer-in-charge:</p>
                  <p>Designation:</p>
                </div>
                <p>Signature: </p>
                <p>Driver Signature</p>
                <p>Receiver Signature</p>
              </div>
              <p className="mt-1">
                <strong>
                  * Applicable to the supplier made to the withholding entity
                  only and in that case it will be used as combined tax invoice
                  cum withholding ccrtifisate.
                </strong>
              </p>
              <p className="mt-1">
                <strong>* Value except all kinds of Tax.</strong>
              </p>
            </div>
          </div>
        </div>
      </IViewModal>
    </div>
  );
}
