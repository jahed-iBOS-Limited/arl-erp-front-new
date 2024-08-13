import moment from "moment";
import React, { useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import printIcon from "../../../_helper/images/print-icon.png";
import IViewModal from "../../../_helper/_viewModal";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReactToPrint from "react-to-print";
import numberWithCommas from "../../../_helper/_numberWithCommas";
import { dateFormatWithMonthName } from "../../../_helper/_dateFormate";
import ProjectedIncomeStatementModal from "./modals/projectedIncomeStatementModal";
const html2pdf = require("html2pdf.js");

export default function ProjectedIncomeStatement({ incomeStatement, values }) {
  const {
    authData: {
      profileData: { accountId, ...restProfileData },
      businessUnitList,
    },
  } = useSelector((state) => state, shallowEqual);

  const printRef = useRef();
  const [showGeneralLedgerModal, setShowGeneralLedgerModal] = useState(false);
  const [incomeStatementRow, setIncomeStatementRow] = useState(null);
  // const [statisticalDetailsModal, setStatisticalDetailsModal] = useState(false);

  const pdfExport = (fileName) => {
    var element = document.getElementById("pdf-section");
    var opt = {
      margin: 20,
      filename: `${fileName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 5,
        dpi: 300,
        letterRendering: true,
        padding: "50px",
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
      },
      jsPDF: { unit: "px", hotfixes: ["px_scaling"], orientation: "landscape" },
    };
    html2pdf()
      .set(opt)
      .from(element)
      .save();
  };

  return (
    <>
      {incomeStatement.length > 0 && (
        <div className="d-flex justify-content-end">
          <ReactHTMLTableToExcel
            id="test-table-xls-button-att-reports"
            className="btn btn-primary m-0 mx-2 py-2 px-2"
            table="table-to-xlsx"
            filename="Income Statement Report"
            sheet="Income Statement Report"
            buttonText="Export Excel"
          />
          <button
            className="btn btn-primary ml-2"
            type="button"
            onClick={(e) => pdfExport("Income Statement Report")}
          >
            Export PDF
          </button>
          <ReactToPrint
            pageStyle={
              "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
            }
            trigger={() => (
              <button
                type="button"
                className="btn btn-sm btn-primary sales_invoice_btn ml-3"
              >
                <img
                  style={{ width: "20px", paddingRight: "5px" }}
                  src={printIcon}
                  alt="print-icon"
                />
                Print
              </button>
            )}
            content={() => printRef.current}
          />
        </div>
      )}

      <div className="row" id="pdf-section" ref={printRef}>
        {incomeStatement.length > 0 && (
          <div className="col-lg-12">
            <div className="titleContent text-center">
              <h2>
                {values?.businessUnit?.value > 0
                  ? values?.businessUnit?.label
                  : restProfileData?.accountName}
              </h2>
              <h4 className="text-primary">Projected Income Statement</h4>
              <p className="m-0">
                <strong>
                  For the period from:{" "}
                  <span>{dateFormatWithMonthName(values?.fromDate)}</span> to{" "}
                  <span>{dateFormatWithMonthName(values?.toDate)}</span>
                </strong>
              </p>
            </div>

            <div className="print_wrapper">
              <div className="table-responsive">
                <table
                  id="table-to-xlsx"
                  className="table table-striped table-bordered mt-3 global-table table-font-size-sm"
                >
                  <thead>
                    <tr>
                      <th style={{ width: "500px" }}>Particulars</th>
                      <th style={{ width: "200px" }}>Note SL</th>

                      <th
                        style={{ width: "250px" }}
                        className="incTableThPadding"
                      >
                        <span>
                          Last Period
                          <br />
                          {/* {`${values?.fromDate} to ${values?.todate}`} */}
                        </span>
                      </th>
                      <th
                        style={{ width: "250px" }}
                        className="incTableThPadding"
                      >
                        <span>
                          Current Period <br />
                          {/* {`${values?.lastPeriodFrom} to ${values?.lastPeriodTo}`} */}
                        </span>
                      </th>
                      <th style={{ width: "250px" }}>Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomeStatement?.map((data, index) => (
                      <>
                        <tr
                          className={
                            data?.intFSId === 0 || data?.intFSId === 20
                              ? "font-weight-bold"
                              : ""
                          }
                        >
                          <td className="text-left">
                            {data?.strFSComponentName}
                          </td>
                          <td></td>

                          <td
                            className="text-right"
                            // onClick={() => {
                            //   if (!(data?.intFSId === 0 || data?.intFSId === 20)) {
                            //     setShowGeneralLedgerModal(true);
                            //     setIncomeStatementRow(data);
                            //   }
                            // }}
                            // style={{
                            //   cursor: "pointer",
                            //   textDecoration:
                            //     data?.intFSId === 0 || data?.intFSId === 20
                            //       ? ""
                            //       : "underline",
                            //   color:
                            //     data?.intFSId === 0 || data?.intFSId === 20
                            //       ? ""
                            //       : "blue",
                            // }}
                          >
                            {/* {_formatMoney(data?.monLastPeriodAmount)} */}
                            {numberWithCommas(
                              Math.round(data?.monLastPeriodAmount) || 0
                            )}
                          </td>
                          <td className="text-right pointer">
                            <span>
                              {" "}
                              {/* {_formatMoney(data?.monCurrentPeriodAmount)} */}
                              {numberWithCommas(
                                Math.round(data?.monCurrentPeriodAmount) || 0
                              )}
                            </span>
                          </td>
                          <td className="text-right">
                            {numberWithCommas(
                              Math.round(data?.monLastPeriodAmount) -
                                Math.round(data?.monCurrentPeriodAmount)
                            )}
                          </td>
                        </tr>
                      </>
                    ))}
                    <tr>
                      <td
                        className="text-center d-none"
                        colSpan={4}
                      >{`System Generated Report - ${moment().format(
                        "LLLL"
                      )}`}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <IViewModal
        show={showGeneralLedgerModal}
        onHide={() => {
          setShowGeneralLedgerModal(false);
          setIncomeStatementRow(null);
        }}
      >
        <ProjectedIncomeStatementModal
          values={values}
          businessUnitList={businessUnitList}
          incomeStatementRow={incomeStatementRow}
          profileData={{ ...restProfileData, accountId }}
        />
      </IViewModal>

      {/* <IViewModal
        show={statisticalDetailsModal}
        onHide={() => {
          setStatisticalDetailsModal(false);
        }}
      >
        <StatisticalDetails formValues={values} />
      </IViewModal> */}
    </>
  );
}
