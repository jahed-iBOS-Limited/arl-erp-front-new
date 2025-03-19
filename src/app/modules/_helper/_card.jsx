import React, { useState } from "react";
import ReactToPrint from "react-to-print";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import printIcon from "./images/print-icon.png";
import IViewModal from "./_viewModal";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

export default function ICard({
  title,
  children,
  isBackBtn,
  clickHandler,
  isShowPrintBtn,
  componentRef,
  isShowPrintPreviewBtn,
  backHandler,
  printTitle,
  isPrint,
  isCreteBtn,
  createHandler,
  pageStyle,
  isHelp,
  helpModalComponent,
  exportTableId,
  /* Excel Button */
  isExcelBtn,
  excelFileNameWillbe,
  documentTitle,
  disableCreateBtn,
  createBtnText,
  createBtnClass,
  // Export Excel
  exportExcel,
  exportExcelTitle,
  exportExcelClickHandler,
  exportExcelDataLength
}) {
  const [isShowModal, setisShowModal] = useState(false);
  return (
    <>
      <Card>
        {true && <ModalProgressBar />}
        <CardHeader title={title}>
          {
            <CardHeaderToolbar>
              {isHelp && (
                <button
                  type="button"
                  className="btn btn-primary mr-2"
                  onClick={() => {
                    setisShowModal(true);
                  }}
                >
                  Help
                </button>
              )}
              {isBackBtn && (
                <button
                  type="button"
                  className="btn btn-light"
                  style={{ marginRight: "3px" }}
                  onClick={backHandler}
                >
                  <i className="fa fa-arrow-left"></i>
                  Back
                </button>
              )}
              {(isCreteBtn || createHandler) && (
                <button
                  type="button"
                  className={`btn ${
                    createBtnClass ? createBtnClass : "btn-primary"
                  }`}
                  style={{ marginRight: "3px" }}
                  onClick={createHandler}
                  disabled={disableCreateBtn}
                >
                  {`${createBtnText ? createBtnText : "Create"}`}
                </button>
              )}
              <button
                type="button"
                className={isShowPrintPreviewBtn ? "btn btn-primary" : "d-none"}
                onClick={clickHandler}
              >
                {/* <img
                  style={{ width: "25px", paddingRight: "5px" }}
                  src={printIcon}
                  alt="print-icon"
                /> */}
                <i class="fa fa-print" aria-hidden="true"></i>
                {printTitle}
              </button>
              <ReactToPrint
                documentTitle={documentTitle || "Report"}
                trigger={() => (
                  <button
                    type="button"
                    className={`${
                      isShowPrintBtn
                        ? "btn btn-primary m-0 px-2 py-1"
                        : "d-none"
                    }
                      ${isExcelBtn ? "px-4 py-1" : ""}
                    `}
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
                content={() => componentRef.current}
                pageStyle={pageStyle}
              />

              {/* If You use isExcelBtn Then you need to add a id in your <table></table> tag. The id will be "table-to-xlsx" */}
              {isExcelBtn ? (
                <div className="ml-2">
                  <ReactHTMLTableToExcel
                    id="test-table-xls-button-att-reports"
                    className="btn btn-primary"
                    table={exportTableId ? exportTableId : "table-to-xlsx"}
                    filename={
                      excelFileNameWillbe ? excelFileNameWillbe : "Sheet"
                    }
                    sheet={excelFileNameWillbe ? excelFileNameWillbe : "Sheet"}
                    buttonText="Export Excel"
                  />
                </div>
              ) : null}

              {exportExcel ? (
                <button
                  className="btn btn-primary mx-1"
                  type="button"
                  onClick={exportExcelClickHandler}                  
                  disabled={exportExcelDataLength > 0 ? false : true}
                >
                  {exportExcelTitle || "Export Excel"}
                </button>
              ) : (
                <></>
              )}
            </CardHeaderToolbar>
          }
        </CardHeader>
        <CardBody>
          <div className="mt-0">
            {/* modal*/}
            {isHelp && (
              <IViewModal
                show={isShowModal}
                onHide={() => setisShowModal(false)}
              >
                {helpModalComponent}
              </IViewModal>
            )}
            {children}
          </div>
        </CardBody>
      </Card>
    </>
  );
}
