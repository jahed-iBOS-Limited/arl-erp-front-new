import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import { _todayDate } from "../../../../_helper/_todayDate";
import { useSelector, shallowEqual } from "react-redux";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import { moneyInWord } from "../../../../_helper/_convertMoneyToWord";
import { dateFormatWithMonthName } from "../../../../_helper/_dateFormate";
import { advicePrintCount } from "../helper";

import { FormatFour } from "../pdf/format-04";

import { Above35SCB } from "../pdf/above35SCB";

import { Below35SCB } from "../pdf/below35SCB";

import { ImportAdvice } from "../pdf/importAdvice";
import { APIUrl } from "../../../../../App";
import ZakatAdvice from "../pdf/zakatAdvice";

import PrimeForEFT from "../pdf/PrimeForEFT";
import PrimeBEFTNForEFT from "../pdf/PrimeBEFTNForEFT";
import { excelGenerator } from "./excelGenerator";
import { getPdfFormatNumber } from "./pdfGenerator";
import FormatOne from "../pdf/format-01";
import FormatTwo from "../pdf/format-02";
import FormatThree from "../pdf/format-03";
import { FormatFive } from "../pdf/format-05";
import { FormatSix } from "../pdf/format-06";
import { FormatSeven } from "../pdf/format-07";
const ViewData = ({ adviceReportData, values }) => {
  const [fontSize, setFontSize] = useState(9);
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const printRef = useRef();
  const [total, setTotal] = useState(0);
  const [totalInWords, setTotalInWords] = useState(0);

  useEffect(() => {
    if (adviceReportData.length > 0) {
      setTotal(
        Number(
          adviceReportData
            ?.reduce((acc, item) => acc + item?.numAmount, 0)
            .toFixed(2)
        )
      );
    }
  }, [adviceReportData]);

  useEffect(() => {
    if (total) {
      moneyInWord(total, setTotalInWords);
    }
  }, [total]);

  const isPotrate = (values) => {
    if (values?.adviceType?.value === 1) {
      if (["ibbl", "jamunaBEFTN", "prime"].includes(values?.advice?.info)) {
        return true;
      }
      return false;
    } else if (values?.adviceType?.value === 5) {
      return true;
    }
  };

  return (
    <>
      <div className="d-flex justify-content-end align-items-end">
        <div className="d-flex flex-column" style={{ width: "60px" }}>
          <label>Font Size</label>
          <input
            value={fontSize}
            onChange={(e) => {
              if (+e?.target?.value >= 8 && +e?.target?.value <= 15) {
                setFontSize(+e?.target?.value);
              }
            }}
            type="number"
          />
        </div>
        <button
          style={{ height: "30px" }}
          className="btn btn-primary btn-sm m-0 mx-2 py-2 px-2"
          onClick={(e) => {
            excelGenerator(
              values,
              adviceReportData,
              selectedBusinessUnit,
              total,
              totalInWords
            );
          }}
        >
          Export Excel
        </button>
        <ReactToPrint
          pageStyle={
            isPotrate(values) &&
            "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
          }
          trigger={() => (
            <button
              className="btn btn-primary btn-sm d-flex align-items-center "
              style={{ height: "30px" }}
            >
              <img
                style={{ width: "25px", paddingRight: "5px", height: "" }}
                src={printIcon}
                alt="print-icon"
              />
              Print
            </button>
          )}
          content={() => printRef.current}
          onBeforePrint={() => {
            advicePrintCount(
              adviceReportData?.map((item) => {
                return {
                  journalId: item?.intJournalId,
                  actionBy: profileData?.userId,
                };
              })
            );
          }}
        />
      </div>

      <div
        id="bank-advice-pdf-section"
        ref={printRef}
        unselectable="on"
        className="noselect"
      >
        {adviceReportData?.length > 0 && (
          <div className="row" unselectable="on">
            <div className="col-lg-12 my-3">
              <>
                <div
                  className="advice-table-wrapper"
                  ref={printRef}
                  style={{ margin: "0 60px" }}
                >
                  {getPdfFormatNumber(
                    values?.adviceType?.value,
                    values?.advice?.value
                  ) === 1 && (
                    <FormatOne
                      fontSize={fontSize}
                      APIUrl={APIUrl}
                      selectedBusinessUnit={selectedBusinessUnit}
                      values={values}
                      adviceReportData={adviceReportData}
                      total={total}
                      totalInWords={totalInWords}
                    />
                  )}
                  {getPdfFormatNumber(
                    values?.adviceType?.value,
                    values?.advice?.value
                  ) === 2 && (
                    <FormatTwo
                      fontSize={fontSize}
                      APIUrl={APIUrl}
                      selectedBusinessUnit={selectedBusinessUnit}
                      values={values}
                      adviceReportData={adviceReportData}
                      total={total}
                      totalInWords={totalInWords}
                    />
                  )}
                  {getPdfFormatNumber(
                    values?.adviceType?.value,
                    values?.advice?.value
                  ) === 3 && (
                    <FormatThree
                      fontSize={fontSize}
                      APIUrl={APIUrl}
                      selectedBusinessUnit={selectedBusinessUnit}
                      values={values}
                      adviceReportData={adviceReportData}
                      total={total}
                      totalInWords={totalInWords}
                    />
                  )}
                  {getPdfFormatNumber(
                    values?.adviceType?.value,
                    values?.advice?.value
                  ) === 4 && (
                    <FormatFour
                      fontSize={fontSize}
                      APIUrl={APIUrl}
                      selectedBusinessUnit={selectedBusinessUnit}
                      values={values}
                      adviceReportData={adviceReportData}
                      total={total}
                      totalInWords={totalInWords}
                    />
                  )}
                  {getPdfFormatNumber(
                    values?.adviceType?.value,
                    values?.advice?.value
                  ) === 5 && (
                    <FormatFive
                      fontSize={fontSize}
                      APIUrl={APIUrl}
                      selectedBusinessUnit={selectedBusinessUnit}
                      values={values}
                      adviceReportData={adviceReportData}
                      total={total}
                      totalInWords={totalInWords}
                    />
                  )}
                  {getPdfFormatNumber(
                    values?.adviceType?.value,
                    values?.advice?.value
                  ) === 6 && (
                    <FormatSix
                      fontSize={fontSize}
                      APIUrl={APIUrl}
                      selectedBusinessUnit={selectedBusinessUnit}
                      values={values}
                      adviceReportData={adviceReportData}
                      total={total}
                      totalInWords={totalInWords}
                    />
                  )}
                  {getPdfFormatNumber(
                    values?.adviceType?.value,
                    values?.advice?.value
                  ) === 7 && (
                    <FormatSeven
                      fontSize={fontSize}
                      APIUrl={APIUrl}
                      selectedBusinessUnit={selectedBusinessUnit}
                      values={values}
                      adviceReportData={adviceReportData}
                      total={total}
                      totalInWords={totalInWords}
                    />
                  )}
                  {getPdfFormatNumber(
                    values?.adviceType?.value,
                    values?.advice?.value
                  ) === 6 ? (
                    <FormatSix
                      fontSize={fontSize}
                      APIUrl={APIUrl}
                      selectedBusinessUnit={selectedBusinessUnit}
                      values={values}
                      adviceReportData={adviceReportData}
                      total={total}
                      totalInWords={totalInWords}
                    />
                  ) : (
                    <div>
                      {[1, 12, 13, 14].includes(values?.adviceType?.value) && (
                        <div>
                          {["ibblBEFTN", "scb", "ibbl"].includes(
                            values?.advice?.info
                          ) && (
                            <>
                              <div className="d-flex flex-column justify-content-center align-items-center my-3">
                                <div
                                  style={{
                                    position: "absolute",
                                    left: "75px",
                                    top: "0",
                                  }}
                                >
                                  <img
                                    style={{ width: "55px" }}
                                    src={`${APIUrl}/domain/Document/DownlloadFile?id=${selectedBusinessUnit?.imageId}`}
                                    alt=""
                                  />
                                </div>
                                <h1
                                  style={{
                                    textDecoration: "underline",
                                    fontSize: "14px",
                                  }}
                                >
                                  {selectedBusinessUnit?.label}
                                </h1>
                                <h3
                                  style={{
                                    textDecoration: "underline",
                                    fontSize: "12px",
                                  }}
                                >
                                  Akij House, 198 Bir Uttam, Gulshan Link Road,
                                  Tejgaon, Dhaka-1208.
                                </h3>
                              </div>
                              <div
                                className="salaryAdvice"
                                style={{ marginTop: "30px" }}
                              >
                                <div className="d-flex flex-column">
                                  <div className="d-flex justify-content-between">
                                    <p
                                      style={{ fontSize: "10px" }}
                                      className="font-weight-bold"
                                    >
                                      To
                                    </p>
                                    <p
                                      style={{ fontSize: "10px" }}
                                      className="font-weight-bold"
                                    >
                                      Date:{" "}
                                      {dateFormatWithMonthName(_todayDate())}
                                    </p>
                                  </div>
                                  <p
                                    style={{ fontSize: "10px" }}
                                    className="font-weight-bold"
                                  >
                                    The Manager
                                  </p>
                                </div>
                                <p
                                  style={{ fontSize: "10px" }}
                                  className="font-weight-bold"
                                >
                                  {values?.bankAccountNo?.bankName}
                                </p>
                                <p
                                  style={{ fontSize: "10px" }}
                                  className="font-weight-bold"
                                >
                                  {values?.bankAccountNo?.address}
                                </p>
                                <p
                                  className="font-weight-bold"
                                  style={{
                                    textDecoration: "underline",
                                    fontSize: "10px",
                                  }}
                                >
                                  Subject :{" "}
                                  {values?.advice?.info === "ibbl"
                                    ? "Payment Instruction."
                                    : "Payment Instruction by BEFTN."}
                                </p>
                                <p
                                  style={{ fontSize: "10px" }}
                                  className="dearSirSpace font-weight-bold"
                                >
                                  Dear Sir,
                                </p>
                                <p
                                  style={{ fontSize: "10px" }}
                                  className="font-weight-bold"
                                >
                                  {`We do hereby requesting you to make
                    payment by transferring the amount to the
                    respective Account Holder as shown below
                    in detailed by debiting our CD Account No.
                    ${values?.bankAccountNo?.bankAccNo}`}
                                </p>
                                <p
                                  style={{ fontSize: "10px" }}
                                  className="font-weight-bold"
                                >
                                  Detailed particulars of each Account Holder:
                                </p>
                              </div>
                              <div className="table-responsive">
                              <table className="table table-striped table-bordered  advice-table table-font-size-sm">
                                <thead>
                                  {["ibblBEFTN", "scb"].includes(
                                    values?.advice?.info
                                  ) ? (
                                    <tr>
                                      <td
                                        style={{
                                          width: "115px",
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        Account Name
                                      </td>
                                      <td
                                        style={{
                                          width: "53px",
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        Code No
                                      </td>
                                      <td
                                        style={{
                                          width: "120px",
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        Bank Name
                                      </td>
                                      <td
                                        style={{
                                          width: "70px",
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        Branch Name
                                      </td>
                                      <td
                                        style={{
                                          width: "50px",
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        A/C Type
                                      </td>
                                      <td
                                        style={{
                                          width: "80px",
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        Account No
                                      </td>
                                      <td
                                        style={{
                                          width: "57px",
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        Amount{" "}
                                      </td>
                                      <td
                                        style={{
                                          width: "70px",
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        Payment Info
                                      </td>
                                      <td
                                        style={{
                                          width: "110px",
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        Comments
                                      </td>
                                      <td
                                        style={{
                                          width: "80px",
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        Routing No
                                      </td>
                                      <td
                                        style={{
                                          width: "80px",
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        Instrument No
                                      </td>
                                      <td
                                        style={{
                                          width: "35px",
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        Sl No
                                      </td>
                                      {values?.advice?.info === "scb" && (
                                        <td
                                          style={{
                                            border: "1px solid #000",
                                            textAlign: "center",
                                            width: "100px",
                                          }}
                                        >
                                          Debit Account
                                        </td>
                                      )}
                                    </tr>
                                  ) : (
                                    <tr>
                                      <td
                                        style={{
                                          width: "35px",
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        Sl No
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        Bank Account No
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        Account Name
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        Net Amount{" "}
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        Instrument No
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        Branch
                                      </td>
                                    </tr>
                                  )}
                                </thead>

                                {/* tbody */}
                                <tbody>
                                  {["ibblBEFTN", "scb"].includes(
                                    values?.advice?.info
                                  ) ? (
                                    <>
                                      {adviceReportData?.map((itm, index) => {
                                        return (
                                          <tr key={index}>
                                            <td
                                              style={{
                                                border: "1px solid #000",
                                              }}
                                              className="text-left"
                                            >
                                              <div
                                                className="pl-1"
                                                style={{
                                                  ...(fontSize && { fontSize }),
                                                }}
                                              >
                                                {itm?.strBankAccountName}
                                              </div>
                                            </td>
                                            <td
                                              style={{
                                                border: "1px solid #000",
                                              }}
                                            >
                                              <div
                                                style={{
                                                  ...(fontSize && { fontSize }),
                                                }}
                                              >
                                                {itm?.strPayeCode}
                                              </div>
                                            </td>
                                            <td
                                              style={{
                                                border: "1px solid #000",
                                              }}
                                            >
                                              <div
                                                className="pl-1"
                                                style={{
                                                  ...(fontSize && { fontSize }),
                                                }}
                                              >
                                                {itm?.strBankName}
                                              </div>
                                            </td>
                                            <td
                                              style={{
                                                border: "1px solid #000",
                                              }}
                                            >
                                              <div
                                                className="pl-1"
                                                style={{
                                                  ...(fontSize && { fontSize }),
                                                }}
                                              >
                                                {itm?.strBankBranchName}
                                              </div>
                                            </td>
                                            <td
                                              style={{
                                                border: "1px solid #000",
                                              }}
                                            >
                                              <div
                                                className="pl-1"
                                                style={{
                                                  ...(fontSize && { fontSize }),
                                                }}
                                              >
                                                {itm?.strBankAccType}
                                              </div>
                                            </td>
                                            <td
                                              style={{
                                                border: "1px solid #000",
                                              }}
                                            >
                                              <div
                                                className="text-right pr-2"
                                                style={{
                                                  ...(fontSize && { fontSize }),
                                                }}
                                              >
                                                <span className="d-none">
                                                  {` ${"\u200C"} `}
                                                </span>
                                                <span>
                                                  {itm?.strBankAccountNo}
                                                </span>
                                              </div>
                                            </td>
                                            <td
                                              style={{
                                                border: "1px solid #000",
                                              }}
                                            >
                                              <div
                                                className="text-right pr-2"
                                                style={{
                                                  ...(fontSize && { fontSize }),
                                                }}
                                              >
                                                {numberWithCommas(
                                                  itm?.numAmount
                                                )}
                                              </div>
                                            </td>
                                            <td
                                              style={{
                                                border: "1px solid #000",
                                              }}
                                            >
                                              <div
                                                className="text-left"
                                                style={{
                                                  ...(fontSize && { fontSize }),
                                                }}
                                              >
                                                {itm?.strPaymentReff || "N/A"}
                                              </div>
                                            </td>
                                            <td
                                              style={{
                                                border: "1px solid #000",
                                              }}
                                            >
                                              <div
                                                className="pl-1"
                                                style={{
                                                  ...(fontSize && { fontSize }),
                                                }}
                                              >
                                                {itm?.strComments}
                                              </div>
                                            </td>
                                            <td
                                              style={{
                                                border: "1px solid #000",
                                              }}
                                            >
                                              <div
                                                className="text-right pr-2"
                                                style={{
                                                  ...(fontSize && { fontSize }),
                                                }}
                                              >
                                                <span className="d-none">
                                                  {` ${"\u200C"} `}
                                                </span>
                                                <span>
                                                  {itm?.strRoutingNumber}
                                                </span>
                                              </div>
                                            </td>
                                            <td
                                              style={{
                                                border: "1px solid #000",
                                              }}
                                            >
                                              <div
                                                className="text-left"
                                                style={{
                                                  ...(fontSize && { fontSize }),
                                                }}
                                              >
                                                {itm?.strInstrumentNo}
                                              </div>
                                            </td>
                                            <td
                                              style={{
                                                border: "1px solid #000",
                                              }}
                                            >
                                              <div
                                                className="text-center"
                                                style={{
                                                  ...(fontSize && { fontSize }),
                                                }}
                                              >
                                                {" "}
                                                {index + 1}
                                              </div>
                                            </td>
                                            {values?.advice?.info === "scb" && (
                                              <td
                                                style={{
                                                  border: "1px solid #000",
                                                  textAlign: "center",
                                                }}
                                              >
                                                {
                                                  values?.bankAccountNo
                                                    ?.bankAccNo
                                                }
                                              </td>
                                            )}
                                          </tr>
                                        );
                                      })}
                                      <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td
                                          className="font-weight-bold"
                                          style={{
                                            border: "1px solid #000",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          <div className="font-weight-bold text-left pl-2 text-right">
                                            Total
                                          </div>
                                        </td>
                                        <td
                                          align="right"
                                          className="font-weight-bold"
                                          style={{
                                            border: "1px solid #000",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          <div className="font-weight-bold text-right">
                                            {adviceReportData.length > 0 &&
                                              numberWithCommas(total)}
                                          </div>
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        {values?.advice?.info === "scb" && (
                                          <td
                                            style={{
                                              border: "1px solid #000",
                                              textAlign: "center",
                                            }}
                                          ></td>
                                        )}
                                      </tr>
                                    </>
                                  ) : (
                                    <>
                                      {adviceReportData?.map((itm, index) => {
                                        return (
                                          <tr key={index}>
                                            <td
                                              style={{
                                                border: "1px solid #000",
                                              }}
                                            >
                                              <div className="text-center">
                                                {" "}
                                                {index + 1}
                                              </div>
                                            </td>
                                            <td
                                              style={{
                                                border: "1px solid #000",
                                              }}
                                            >
                                              <div className="pl-2">
                                                <span className="d-none">
                                                  {` ${"\u200C"} `}
                                                </span>
                                                <span>{itm?.strAccountNo}</span>
                                              </div>
                                            </td>
                                            <td
                                              style={{
                                                border: "1px solid #000",
                                              }}
                                            >
                                              <div className="pl-2">
                                                {itm?.strBankAccountName}
                                              </div>
                                            </td>
                                            <td
                                              style={{
                                                border: "1px solid #000",
                                              }}
                                            >
                                              <div className="text-right pr-2">
                                                {numberWithCommas(
                                                  itm?.numAmount
                                                )}
                                              </div>
                                            </td>
                                            <td
                                              style={{
                                                border: "1px solid #000",
                                              }}
                                            >
                                              <div className="text-left pl-2">
                                                {itm?.strInstrumentNo}
                                              </div>
                                            </td>
                                            <td
                                              style={{
                                                border: "1px solid #000",
                                              }}
                                            >
                                              <div className="pl-2">
                                                {itm?.strBankBranchName}
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })}

                                      <tr>
                                        <td></td>
                                        <td></td>
                                        <td
                                          className="font-weight-bold"
                                          style={{
                                            border: "1px solid #000",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          <div className="font-weight-bold text-left pl-2 text-right">
                                            Total Net Amount
                                          </div>
                                        </td>
                                        <td
                                          className="font-weight-bold"
                                          style={{
                                            border: "1px solid #000",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          <div className="font-weight-bold text-right">
                                            {adviceReportData.length > 0 &&
                                              numberWithCommas(total)}
                                          </div>
                                        </td>
                                        <td></td>
                                        <td></td>
                                      </tr>
                                    </>
                                  )}
                                </tbody>
                              </table>
      </div>
                              <p
                                className="font-weight-bold mt-5"
                                style={{
                                  textTransform: "capitalize",
                                  fontSize: "11px",
                                }}
                              >
                                In Word:{" "}
                                {adviceReportData.length > 0 && totalInWords}{" "}
                                Taka Only
                              </p>
                              <p
                                className="font-weight-bold"
                                style={{ fontSize: "11px" }}
                              >
                                For {selectedBusinessUnit?.label}
                              </p>
                              <div
                                className="font-weight-bold "
                                style={{ marginTop: "60px" }}
                              >
                                <div className="d-flex">
                                  <h6
                                    style={{
                                      marginRight: "50px",
                                      fontSize: "11px",
                                    }}
                                  >
                                    Authorize Signature
                                  </h6>
                                  <h6
                                    style={{
                                      marginRight: "50px",
                                      fontSize: "11px",
                                    }}
                                  >
                                    Authorize Signature
                                  </h6>
                                </div>
                              </div>
                            </>
                          )}
                          {["jamunaBEFTN"].includes(values?.advice?.info) && (
                            <FormatFour
                              selectedBusinessUnit={selectedBusinessUnit}
                              values={values}
                              adviceReportData={adviceReportData}
                              total={total}
                              totalInWords={totalInWords}
                            />
                          )}

                          {["above36Character"].includes(
                            values?.advice?.info
                          ) && (
                            <Above35SCB
                              selectedBusinessUnit={selectedBusinessUnit}
                              values={values}
                              adviceReportData={adviceReportData}
                              total={total}
                              totalInWords={totalInWords}
                            />
                          )}
                          {["below36Character"].includes(
                            values?.advice?.info
                          ) && (
                            <Below35SCB
                              selectedBusinessUnit={selectedBusinessUnit}
                              values={values}
                              adviceReportData={adviceReportData}
                              total={total}
                              totalInWords={totalInWords}
                            />
                          )}
                          {["import"].includes(values?.advice?.info) && (
                            <ImportAdvice
                              selectedBusinessUnit={selectedBusinessUnit}
                              values={values}
                              adviceReportData={adviceReportData}
                              total={total}
                              totalInWords={totalInWords}
                            />
                          )}
                          {["prime"].includes(values?.advice?.info) && (
                            <PrimeForEFT
                              selectedBusinessUnit={selectedBusinessUnit}
                              values={values}
                              adviceReportData={adviceReportData}
                              total={total}
                              totalInWords={totalInWords}
                            />
                          )}
                          {["primeBEFTN"].includes(values?.advice?.info) && (
                            <PrimeBEFTNForEFT
                              selectedBusinessUnit={selectedBusinessUnit}
                              values={values}
                              adviceReportData={adviceReportData}
                              total={total}
                              totalInWords={totalInWords}
                            />
                          )}
                        </div>
                      )}
                      {values?.adviceType?.value === 15 && (
                        <ZakatAdvice
                          selectedBusinessUnit={selectedBusinessUnit}
                          values={values}
                          adviceReportData={adviceReportData}
                          total={total}
                          totalInWords={totalInWords}
                        />
                      )}
                    </div>
                  )}
                </div>
              </>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewData;
