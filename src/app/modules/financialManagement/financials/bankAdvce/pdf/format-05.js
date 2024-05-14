/* eslint-disable no-unused-vars */
import React from "react";
import { dateFormatWithMonthName } from "../../../../_helper/_dateFormate";
import { APIUrl } from "../../../../../App";
import { _formatMoney } from "../../../../_helper/_formatMoney";
export const FormatFive = ({
  selectedBusinessUnit,
  values,
  adviceReportData,
  total,
  totalInWords,
  fontSize
}) => {
  return (
    <div style={{ margin: "30px 90px" }}>
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
      <div className="my-3 salaryAdvice">
        <div className="d-flex flex-column">
          <p style={{ fontSize: "14px" }}>
            Date: {dateFormatWithMonthName(values?.dateTime)}
          </p>
          <p style={{ fontSize: "14px" }}>To</p>

          <p style={{ fontSize: "14px" }}>The Manager</p>
        </div>
        <p style={{ fontSize: "14px" }}>{values?.bankAccountNo?.bankName}</p>
        <p style={{ fontSize: "14px" }}>{values?.bankAccountNo?.address}</p>
        <p
          style={{ fontSize: "14px" }}
          className="font-weight-bold"
          // style={{ textDecoration: "underline" }}
        >
          Subject: Request to Debit our account by settleing as per
          instructions.
        </p>
        <p
          style={{ fontSize: "14px" }}
          className="dearSirSpace font-weight-bold"
        >
          Dear Sir,
        </p>
        <p style={{ fontSize: "14px" }} className="font-weight-bold">
          Assalamu-Alaikum.
        </p>
        <p style={{ fontSize: "14px" }} className="">
          {`You are requestd to debit our account No: ${values?.bankAccountNo?.bankAccNo} by settling as per instructions below:`}
        </p>
      </div>
      <div className="table-responsive">
      <table className="table table-striped table-bordered global-table payorder-advice-table">
        <thead>
          <tr>
            <td
              style={{
                width: "60px",
                border: "1px solid #000",
                textAlign: "center",
                fontSize: "13px",
              }}
            >
              SL No.
            </td>
            <td
              style={{
                width: "200px",
                border: "1px solid #000",
                textAlign: "center",
                fontSize: "13px",
              }}
            >
              Ref:
            </td>
            <td
              style={{
                border: "1px solid #000",
                textAlign: "center",
                fontSize: "13px",
              }}
            >
              Description
            </td>
            <td
              style={{
                width: "100px",
                border: "1px solid #000",
                textAlign: "center",
                fontSize: "13px",
              }}
            >
              Debiting Amt.
            </td>
          </tr>
        </thead>
        <tbody>
          {adviceReportData?.map((itm, index) => {
            return (
              <tr key={index}>
                <td
                  style={{
                    border: "1px solid #000",
                    textAlign: "center !important",
                    ...(fontSize && { fontSize }),
                  }}
                >
                  {index + 1}
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    textAlign: "left",
                    ...(fontSize && { fontSize }),
                  }}
                >
                  {itm?.strInstrumentNo}
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    ...(fontSize && { fontSize }),
                    textAlign: "left",
                  }}
                >
                  {"Issue a Pay Order in favour of " + itm?.strPayee}
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    textAlign: "right",
                    ...(fontSize && { fontSize }),
                  }}
                >
                  {_formatMoney(itm?.numAmount)}
                </td>
              </tr>
            );
          })}
          <tr>
            <td></td>
            <td></td>
            <td
              style={{
                border: "1px solid #000",
                fontWeight: "bold",
                ...(fontSize && { fontSize }),
              }}
              className="font-weight-boldtext-right"
            >
              Total
            </td>
            <td
              align="right"
              className="font-weight-bold text-right"
              style={{
                border: "1px solid #000",
                fontWeight: "bold",
                ...(fontSize && { fontSize }),
              }}
            >
              {adviceReportData.length > 0 && _formatMoney(total)}
            </td>
          </tr>
        </tbody>
      </table>
     </div>
      <p
        className=" mt-5"
        style={{
          textTransform: "capitalize",
          fontSize: "14px",
        }}
      >
        In Word: {adviceReportData.length > 0 && totalInWords} Taka Only
      </p>
      <p className="mt-5" style={{ fontSize: "14px" }}>
        Yours faithfully
      </p>
      <p className="font-weight-bold" style={{ fontSize: "14px" }}>
        For {selectedBusinessUnit?.label}
      </p>
      <div className="font-weight-bold " style={{ marginTop: "60px" }}>
        <div className="d-flex">
          <h6
            style={{
              marginRight: "50px",
              fontSize: "14px",
            }}
          >
            Authorize Signature
          </h6>
          <h6
            style={{
              marginRight: "50px",
              fontSize: "14px",
            }}
          >
            Authorize Signature
          </h6>
        </div>
      </div>
    </div>
  );
};
