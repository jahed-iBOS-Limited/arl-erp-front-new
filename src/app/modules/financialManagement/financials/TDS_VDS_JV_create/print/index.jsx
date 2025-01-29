import React, { useRef } from "react";
import { getLetterHead } from "../../../report/bankLetter/helper";
import { shallowEqual, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import Print from "./print";
import "./style.scss";

export default function PrintView({ selectedRow,currentSelectedAccNo }) {
  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const printRef = useRef();

  const handleInvoicePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle:
      "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}",
  });

  return (
    <>
      <div className="text-right">
        <button
          onClick={() => {
            handleInvoicePrint();
          }}
          type="button"
          className="btn btn-primary my-5"
        >
          Print
        </button>
      </div>
      <div ref={printRef} id="tds-vds-print-wrapper">
        <div style={{ margin: "-13px 50px 51px 50px" }}>
          <div
            className="invoice-header"
            style={{
              backgroundImage: `url(${getLetterHead({
                buId: selectedBusinessUnit?.value,
              })})`,
              backgroundRepeat: "no-repeat",
              height: "150px",
              backgroundPosition: "left 10px",
              backgroundSize: "cover",
              position: "fixed",
              width: "100%",
              top: "-50px",
            }}
          ></div>
          <div
            className="invoice-footer"
            style={{
              backgroundImage: `url(${getLetterHead({
                buId: selectedBusinessUnit?.value,
              })})`,
              backgroundRepeat: "no-repeat",
              height: "100px",
              backgroundPosition: "left bottom",
              backgroundSize: "cover",
              bottom: "-0px",
              position: "fixed",
              width: "100%",
            }}
          ></div>
          <table>
            <thead>
              <tr>
                <td
                  style={{
                    border: "none",
                  }}
                >
                  {/* place holder for the fixed-position header */}
                  <div
                    style={{
                      height: "110px",
                    }}
                  ></div>
                </td>
              </tr>
            </thead>
            {/* CONTENT GOES HERE (Send selected row & current selected account number which is selected in formik*/}
            <tbody>
              <Print selectedRow={selectedRow}  currentSelectedAccNo={currentSelectedAccNo}/>
            </tbody>
            <tfoot>
              <tr>
                <td
                  style={{
                    border: "none",
                  }}
                >
                  {/* place holder for the fixed-position footer */}
                  <div
                    style={{
                      height: "150px",
                    }}
                  ></div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
}
