import React, { useRef } from "react";
import IViewModal from "./../../../_helper/_viewModal";
import printIcon from "./../../../_helper/images/print-icon.png";
import ReactToPrint from "react-to-print";
import {
  EditTaxSalesInvoicePrintStatus_api,
  GetTaxSalesInvoicePrintStatus_api,
} from "./helper";
import Loading from "../../../_helper/_loading";

import PrintViewSixPointThree from "./printView";
const html2pdf = require("html2pdf.js");

export default function SalesInvoiceModel({
  show,
  onHide,
  singleData,
  salesInvoicePrintStatus,
  salesTableRowDto,
  setSalesInvoicePrintStatus,
  loading,
}) {
  const printRef = useRef();
  const cb = (id) => {
    GetTaxSalesInvoicePrintStatus_api(id, setSalesInvoicePrintStatus);
  };

  const pdfExport = (fileName) => {
    var element = document.getElementById("pdf-section");
    var opt = {
      margin: 1,
      filename: `${fileName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 5,
        dpi: 300,
        letterRendering: true,
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: { unit: "px", hotfixes: ["px_scaling"], orientation: "landscape" },
    };
    html2pdf()
      .set(opt)
      .from(element)
      .save();
  };

  return (
    <div>
      {loading && <Loading />}
      <IViewModal
        show={show}
        onHide={onHide}
        title={"Sales Invoice"}
        btnText="Close"
        componentRef={printRef}
      >
        <div>
          <div className="col-lg-4 offset-8 d-flex justify-content-end">
            <span
              onClick={() => {
                EditTaxSalesInvoicePrintStatus_api(
                  salesTableRowDto?.taxSalesId,
                  cb
                );
              }}
            >
              <ReactToPrint
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
            <button
              className="btn btn-primary ml-2"
              type="button"
              onClick={(e) => pdfExport("Mushak-6.3")}
            >
              Export PDF
            </button>
          </div>
          <div ref={printRef}>
            <PrintViewSixPointThree
              salesInvoicePrintStatus={salesInvoicePrintStatus}
              singleData={singleData}
            
            />
          </div>
        </div>
      </IViewModal>
    </div>
  );
}
