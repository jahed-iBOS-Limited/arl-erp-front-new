import React from "react";
import ReactToPrint from "react-to-print";
import printIcon from "./images/print-icon.png";

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
  createHandler
}) {
  return (
    <>
      <div className="table-card">
        <div className="table-card-heading">
          <p>{title}</p>
          {isPrint && (
            <div>
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
              {isCreteBtn && (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ marginRight: "3px" }}
                  onClick={createHandler}
                >
                  Create
                </button>
              )}
              <button
                type="button"
                className={isShowPrintPreviewBtn ? "btn btn-primary" : "d-none"}
                onClick={clickHandler}
              >
                <img
                  style={{ width: "25px", paddingRight: "5px" }}
                  src={printIcon}
                  alt="print-icon"
                />
                {printTitle}
              </button>
              <ReactToPrint
                trigger={() => (
                  <button
                    type="button"
                    className={isShowPrintBtn ? "btn btn-primary" : "d-none"}
                  >
                    <img
                      style={{ width: "25px", paddingRight: "5px" }}
                      src={printIcon}
                      alt="print-icon"
                    />
                    Print
                  </button>
                )}
                content={() => componentRef.current}
              />
            </div>
          )}
        </div>
        <div className="table-responsive">
          <div className="mt-0">{children}</div>
        </div>
      </div>
    </>
  );
}
