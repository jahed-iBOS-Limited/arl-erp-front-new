/* eslint-disable no-unused-vars */
import React from "react";
import { dateFormatWithMonthName } from "../../../../_helper/_dateFormate";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import { _todayDate } from "../../../../_helper/_todayDate";
import { APIUrl } from "../../../../../App";
import { _formatMoney } from "../../../../_helper/_formatMoney";
export const FormatSeven = ({
  selectedBusinessUnit,
  values,
  adviceReportData,
  total,
  totalInWords,
  fontSize,
}) => {
  return (
    <div className="advice-table-wrapper" style={{ margin: "0 60px" }}>
      <div className="d-flex flex-column justify-content-center align-items-center my-3">
        <div
          style={{
            position: "absolute",
            left: "75px",
            top: "0",
          }}
        >
          <img
            style={{ width: "65px" }}
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
          Akij House, 198 Bir Uttam, Gulshan Link Road, Tejgaon, Dhaka-1208.
        </h3>
      </div>
      <div className="salaryAdvice" style={{ marginTop: "30px" }}>
        <div className="d-flex flex-column">
          <div className="d-flex justify-content-between">
            <p style={{ fontSize: "10px" }} className="font-weight-bold">
              To
            </p>
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
        <p style={{ fontSize: "10px" }} className="font-weight-bold">
          {`We do hereby requesting you to make
                  payment by transferring the amount to the
                  respective Account Holder as shown below
                  in detailed by debiting our CD Account No.
                  ${values?.bankAccountNo?.bankAccNo}`}
        </p>
        <p style={{ fontSize: "10px" }} className="font-weight-bold">
          Detailed particulars of each Account Holder:
        </p>
      </div>
      <table
        className="table table-striped table-bordered  advice-table table-font-size-sm"
        // style={{ width: "100%" }}
      >
        <thead>
          <tr>
            <td
              style={{
                width: "30px",
                border: "1px solid #000",
                textAlign: "center",
              }}
            >
              SL
            </td>
            <td
              style={{
                width: "100px",
                border: "1px solid #000",
                textAlign: "center",
              }}
            >
              Payee Name
            </td>
            <td
              style={{
                width: "100px",
                border: "1px solid #000",
                textAlign: "center",
              }}
            >
              Payee Account No
            </td>
            <td
              style={{
                width: "70px",
                border: "1px solid #000",
                textAlign: "center",
              }}
            >
              Amount (USD)
            </td>
            <td
              style={{
                width: "100px",
                border: "1px solid #000",
                textAlign: "center",
              }}
            >
              Payee Bank Code
            </td>
            <td
              style={{
                width: "180px",
                border: "1px solid #000",
                textAlign: "center",
              }}
            >
              Reason
            </td>
            <td
              style={{
                width: "100px",
                border: "1px solid #000",
                textAlign: "center",
              }}
            >
              Email
            </td>
          </tr>
        </thead>

        {/* tbody */}
        <tbody>
          {adviceReportData?.map((itm, index) => {
            return (
              <tr key={index}>
                <td
                  style={{
                    border: "1px solid #000",
                  }}
                  className="text-left"
                >
                  <div className="pl-1" style={{
                    ...(fontSize && { fontSize }),
                    }}>
                    {index + 1}
                  </div>
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                  }}
                >
                  <div style={{
                  ...(fontSize && { fontSize }),
                  }}>{itm?.strPayee}</div>
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                  }}
                >
                  <div className="pl-1" style={{
                      ...(fontSize && { fontSize }),
                     }}>
                    {itm?.strBankAccountNo}
                  </div>
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                  }}
                >
                  <div className="text-right pr-2" style={{
                      ...(fontSize && { fontSize }),
                     }}>
                    {numberWithCommas(itm?.numAmount)}
                  </div>
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                  }}
                >
                  <div className="pl-1" style={{
                      ...(fontSize && { fontSize }),
                     }}>
                    {itm?.strPayBankCode}
                  </div>
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                  }}
                >
                  <div className="pl-1" style={{
                      ...(fontSize && { fontSize }),
                     }}>
                    {itm?.strNaration}
                  </div>
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                  }}
                >
                  <div className="pl-1" style={{
                      ...(fontSize && { fontSize }),
                     }}>
                    {itm?.strEmail}
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
              colSpan="3"
            >
              <div className="font-weight-bold text-left pl-2 text-right" style={{
                ...(fontSize && { fontSize }),
                }}>
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
              <div className="font-weight-bold text-right" style={{
                ...(fontSize && { fontSize }),
               }}>
                {adviceReportData.length > 0 &&
                  numberWithCommas(
                    adviceReportData
                      ?.reduce((acc, item) => acc + item?.numAmount, 0)
                      ?.toFixed(2)
                  )}
              </div>
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <p
        className="font-weight-bold mt-5"
        style={{
          textTransform: "capitalize",
          fontSize: "11px",
        }}
      >
        In Word: {adviceReportData.length > 0 && totalInWords} Taka Only
      </p>
      <p className="font-weight-bold" style={{ fontSize: "11px" }}>
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
  );
};
