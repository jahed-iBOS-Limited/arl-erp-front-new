/* eslint-disable no-unused-vars */
import React from "react";
import { dateFormatWithMonthName } from "../../../../_helper/_dateFormate";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import { _todayDate } from "../../../../_helper/_todayDate";
import { APIUrl } from "../../../../../App";
import { _formatMoney } from "../../../../_helper/_formatMoney";

const thStyle = {
  border: "1px solid #000",
  textAlign: "center",
};

export const FormatEight = ({
  selectedBusinessUnit,
  values,
  adviceReportData,
  total,
  totalInWords,
  fontSize,
}) => {
    console.log("ad", adviceReportData)
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
        <h3
          style={{
            textDecoration: "underline",
            fontSize: "12px",
          }}
        >
          RTGS Application Form
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
          We hereby request you to originate an RTGS instruction as per the
          following information we agreed with
        </p>
      </div>
      <table className="table table-striped table-bordered  advice-table table-font-size-sm">
        <thead>
          <tr>
            <td style={thStyle}><b>Particulars</b></td>
            <td colSpan={2} style={thStyle}><b>Sender Information</b></td>
            <td colSpan={2} style={thStyle}><b>Beneficiary Information</b></td>
          </tr>
        </thead>
        <tbody>
          <tr>
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
                Name
              </div>
            </td>
            <td
              colSpan={2}
              style={{
                border: "1px solid #000",
              }}
            >
              <div
                style={{
                  ...(fontSize && { fontSize }),
                }}
              >
                <b>Dynamic Value</b>
              </div>
            </td>
            <td
              colSpan={2}
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
                <b>Dynamic Value</b>
              </div>
            </td>
          </tr>
          <tr>
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
                Bank
              </div>
            </td>
            <td
              colSpan={2}
              style={{
                border: "1px solid #000",
              }}
            >
              <div
                style={{
                  ...(fontSize && { fontSize }),
                }}
              >
                Dynamic Value
              </div>
            </td>
            <td
              colSpan={2}
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
                Dynamic Value
              </div>
            </td>
          </tr>
          <tr>
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
                Branch Name
              </div>
            </td>
            <td
              colSpan={2}
              style={{
                border: "1px solid #000",
              }}
            >
              <div
                style={{
                  ...(fontSize && { fontSize }),
                }}
              >
                Dynamic Value
              </div>
            </td>
            <td
              colSpan={2}
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
                Dynamic Value
              </div>
            </td>
          </tr>
          <tr>
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
                Routing No.
              </div>
            </td>
            <td
              colSpan={2}
              style={{
                border: "1px solid #000",
              }}
            >
              <div
                style={{
                  ...(fontSize && { fontSize }),
                }}
              >
                Dynamic Value
              </div>
            </td>
            <td
              colSpan={2}
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
                <b>Dynamic Value</b>
              </div>
            </td>
          </tr>
          <tr>
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
                Account No.
              </div>
            </td>
            <td
              colSpan={2}
              style={{
                border: "1px solid #000",
              }}
            >
              <div
                style={{
                  ...(fontSize && { fontSize }),
                }}
              >
                <b>Dynamic Value</b>
              </div>
            </td>
            <td
              colSpan={2}
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
                <b>Dynamic Value</b>
              </div>
            </td>
          </tr>
          <tr>
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
                Address
              </div>
            </td>
            <td
              colSpan={2}
              style={{
                border: "1px solid #000",
              }}
            >
              <div
                style={{
                  ...(fontSize && { fontSize }),
                }}
              >
                Akij House, 198 Bir Uttam, Gulshan Link Road, Tejgaon, Dhaka-1208.
              </div>
            </td>
            <td
              colSpan={2}
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
                Akij House, 198 Bir Uttam, Gulshan Link Road, Tejgaon, Dhaka-1208.
              </div>
            </td>
          </tr>
          <tr>
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
                Contact No.
              </div>
            </td>
            <td
              colSpan={2}
              style={{
                border: "1px solid #000",
              }}
            >
              <div
                style={{
                  ...(fontSize && { fontSize }),
                }}
              >
                <b>Dynamic Value</b>
              </div>
            </td>
            <td
              colSpan={2}
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
                <b>Dynamic Value</b>
              </div>
            </td>
          </tr>
          <tr>
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
                Purpose, Please Tick (&#x2713;)
              </div>
            </td>
            <td
              style={{
                border: "1px solid #000",
              }}
              colSpan={4}
            >
              <div
                style={{
                  ...(fontSize && { fontSize }),
                }}
              >
                (i) NRB Remittance (ii) Domestic Remittance (iii) Salary Payment (iv) Bill Payment (v) LC Payment (vi) Warrant/Profit Payment
              </div>
            </td>
          </tr>
          <tr>
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
                Payment Mode, Please Tick (&#x2713;)
              </div>
            </td>
            <td
              colSpan={4}
              style={{
                border: "1px solid #000",
              }}
            >
              <div
                style={{
                  ...(fontSize && { fontSize }),
                }}
              >
                (i) Person to Person (ii) Person to Business (iii) Business to Business (iv) Business to Customer (v) Customer to Customer (vi) Financial Institute to Financial Institute
              </div>
            </td>
          </tr>
          <tr>
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
                <b>Amount</b>
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
                <b>Net Pay</b>
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
                <b>Commission</b>
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
                <b>VAT</b>
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
                <b>Total</b>
              </div>
            </td>
          </tr>
          <tr>
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
                In Figure
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
                <b>{adviceReportData.length > 0 &&
                  numberWithCommas(
                    adviceReportData
                      ?.reduce((acc, item) => acc + item?.numAmount, 0)
                      ?.toFixed(2)
                  )}</b>
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
              >Dynamic Value</div>
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
              >Dynamic Value</div>
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
                Dynamic Value
              </div>
            </td>
          </tr>
          <tr>
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
                Amount in word
              </div>
            </td>
            <td
              style={{
                border: "1px solid #000",
              }}
              colSpan={4}
            >
              <div
                style={{
                  ...(fontSize && { fontSize }),
                }}
              >
                <b>{totalInWords}</b>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p
        className="mt-5"
        style={{
          textTransform: "capitalize",
          fontSize: "11px",
        }}
      >
        {/* In Word: {adviceReportData.length > 0 && totalInWords} Taka Only */}
        Please send an RTGS credit instruction to Dynamic Value
      </p>
      <p>Yours Faithfully,</p>
      <p className="font-weight-bold" style={{ fontSize: "11px" }}>
        For {selectedBusinessUnit?.label}
      </p>
      <p className="font-weight-bold" style={{ fontSize: "11px" }}>
        A/C No : {values?.bankAccountNo?.bankAccNo}
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
