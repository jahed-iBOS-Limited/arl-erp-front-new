/* eslint-disable no-unused-vars */
import React from "react";
import { dateFormatWithMonthName } from "../../../../_helper/_dateFormate";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import { _todayDate } from "../../../../_helper/_todayDate";
import { APIUrl } from "../../../../../App";
export const FormatFour = ({
  selectedBusinessUnit,
  values,
  adviceReportData,
  total,
  totalInWords,
  fontSize,
}) => {
  return (
    <>
      <div className="">
        <div className="d-flex flex-column justify-content-center align-items-center my-3">
          {selectedBusinessUnit?.imageId && (
            <div
              style={{
                position: "absolute",
                left: "100px",
                top: "20px",
              }}
            >
              <img
                style={{ width: "65px" }}
                src={`${APIUrl}/domain/Document/DownlloadFile?id=${selectedBusinessUnit?.imageId}`}
                alt=""
              />
            </div>
          )}

          <h1
            style={{
              textDecoration: "underline",
              fontSize: "22px",
            }}
          >
            {selectedBusinessUnit?.label}
          </h1>
          <h3
            style={{
              textDecoration: "underline",
              fontSize: "18px",
            }}
          >
            Akij House, 198 Bir Uttam, Gulshan Link Road, Tejgaon, Dhaka-1208.
          </h3>
        </div>

        <div className="salaryAdvice" style={{ marginTop: "30px" }}>
          <div className="d-flex flex-column">
            <div className="d-flex justify-content-between">
              <p style={{ fontSize: "10px" }} className="font-weight-bold">
                Date: {dateFormatWithMonthName(_todayDate())}
              </p>
            </div>
            <p style={{ fontSize: "10px" }} className="font-weight-bold">
              The Manager
            </p>
          </div>
          <p style={{ fontSize: "10px" }} className="font-weight-bold">
            {values?.bankAccountNo?.bankName}
          </p>
          <p style={{ fontSize: "10px" }} className="font-weight-bold">
            {values?.bankAccountNo?.address}
          </p>
          <p
            className="font-weight-bolder"
            style={{
              fontSize: "10px",
            }}
          >
            Subject: Fund Transfer through BEFTN
          </p>
          <p
            style={{ fontSize: "10px" }}
            className="dearSirSpace font-weight-bold"
          >
            Dear Sir,
          </p>
          <p style={{ fontSize: "10px" }} className="font-weight-bold">
            Please execute the BEFTN transaction as per following information:
          </p>
          {/* <p style={{ fontSize: "10px" }} className="font-weight-bold">
          Detailed particulars of each Account Holder:
        </p> */}
        </div>
        <table
          className="table table-striped table-bordered  advice-table table-font-size-sm"
          // style={{ width: "100%" }}
        >
          <thead>
            {["jamunaBEFTN", "nrbcblBEFTN"].includes(values?.advice?.info) && (
              <tr>
                <td
                  style={{
                    width: "35px",
                    border: "1px solid #000",
                    textAlign: "center",
                  }}
                  className="text-center"
                >
                  SL test
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    textAlign: "center",
                  }}
                >
                  Beneficiary A/C Name
                </td>
                <td
                  style={{
                    width: "120px",
                    border: "1px solid #000",
                    textAlign: "center",
                  }}
                >
                  Beneficiary A/C No
                </td>
                <td
                  style={{
                    width: "230px",
                    border: "1px solid #000",
                    textAlign: "center",
                  }}
                >
                  Bank Names
                </td>
                <td
                  style={{
                    width: "80px",
                    border: "1px solid #000",
                    textAlign: "center",
                  }}
                >
                  Branch Names
                </td>
                <td
                  style={{
                    width: "80px",
                    border: "1px solid #000",
                    textAlign: "center",
                  }}
                >
                  Routing Code
                </td>
                <td
                  style={{
                    width: "120px",
                    border: "1px solid #000",
                    textAlign: "center",
                  }}
                >
                  Amount (BDT)
                </td>
              </tr>
            )}
          </thead>
          <tbody>
            {["jamunaBEFTN", "nrbcblBEFTN"].includes(values?.advice?.info) && (
              <>
                {adviceReportData?.map((itm, index) => {
                  // netTotal += itm?.numAmount;
                  // seTotalAmount(netTotal);
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
                          {index + 1}
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
                          {itm?.strBankAccountName}
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
                          {itm?.strBankAccountNo}
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
                          {itm?.strRoutingNumber}
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
                          {numberWithCommas(itm?.numAmount)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td
                    className="font-weight-bold"
                    style={{
                      border: "1px solid #000",
                      fontWeight: "bold",
                    }}
                    colSpan="6"
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
                      {adviceReportData.length > 0 && numberWithCommas(total)}
                    </div>
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
        <p
          className=" mt-5"
          style={{
            textTransform: "capitalize",
            fontSize: "11px",
          }}
        >
          <span className="font-weight-bolder"> In Word: </span>
          {adviceReportData.length > 0 && totalInWords} Taka Only
        </p>
        <p className="mt-5" style={{ fontSize: "11px" }}>
          {`In this regard we hereby authorise you to debit our Account Name “${selectedBusinessUnit?.label}”`}
        </p>
        <p style={{ fontSize: "11px" }}>
          {`Account No ${values?.bankAccountNo?.bankAccNo} with your bank by the value of the transaction.`}
        </p>
        <p className="mt-5" style={{ fontSize: "11px" }}>
          Yours Faithfully
        </p>
        <p
          className="mt-5 font-weight-bolder"
          style={{
            textTransform: "capitalize",
            fontSize: "11px",
          }}
        >
          For {selectedBusinessUnit?.label}
        </p>
        <div className="font-weight-bold " style={{ marginTop: "60px" }}>
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
      </div>
    </>
  );
};
