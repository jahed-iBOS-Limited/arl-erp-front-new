/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { dateFormatWithMonthName } from "../../../../_helper/_dateFormate";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import { _todayDate } from "../../../../_helper/_todayDate";
import { APIUrl } from "../../../../../App";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import axios from "axios";
import { useEffect } from "react";

export const fetchMoneyInWord = async (number) => {
  try {
    const res = await axios.get(`/fino/Expense/MoneyInWord?Money=${number}`);
    return res?.data;
  } catch (error) {}
};

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
  const [amounts, setAmounts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const newAmounts = await Promise.all(
        adviceReportData.map(async (item) => {
          const moneyInWord = await fetchMoneyInWord(item?.numAmount);
          return moneyInWord;
        })
      );
      setAmounts(newAmounts);
    };

    fetchData();
  }, [adviceReportData]);

  return (
    <>
      {adviceReportData?.length > 0 &&
        adviceReportData.map((item, index) => (
          <div
            key={index}
            className="advice-table-wrapper rtgs page-break"
            style={{ margin: "0 60px", position: "relative" }}
          >
            <img
              style={{ width: "170px" }}
              src={`${APIUrl}/domain/Document/DownlloadFile?id=${selectedBusinessUnit?.imageId}`}
              alt=""
            />
            <div className="d-flex flex-column justify-content-center align-items-center my-3">
              <h1
                style={{
                  fontSize: "30px",
                }}
              >
                {values?.bankAccountNo?.bankName}
              </h1>
              <h3
                style={{
                  fontSize: "14px",
                }}
              >
                {values?.bankAccountNo?.bankBranchName}
              </h3>
              <h3
                style={{
                  textDecoration: "underline",
                  fontSize: "14px",
                }}
              >
                RTGS Application Form
              </h3>
            </div>
            <div className="salaryAdvice" style={{ marginTop: "30px" }}>
              <p
                style={{ fontSize: "14px" }}
                className="font-weight-bold text-right"
              >
                Date: {dateFormatWithMonthName(values?.dateTime)}
              </p>
              <p
                style={{ fontSize: "14px" }}
                className="dearSirSpace font-weight-bold"
              >
                Dear Sir,
              </p>
              <p
                style={{ fontSize: "14px", marginBottom: "12px" }}
                className="font-weight-bold"
              >
                We hereby request you to originate an RTGS instruction as per
                the following information we agreed with
              </p>
            </div>
            <div className="table-responsive">
              <table className="table table-striped table-bordered  advice-table table-font-size-sm">
                <thead>
                  <tr>
                    <td style={thStyle}>
                      <b>Particulars</b>
                    </td>
                    <td colSpan={2} style={thStyle}>
                      <b>Sender Information</b>
                    </td>
                    <td colSpan={2} style={thStyle}>
                      <b>Beneficiary Information</b>
                    </td>
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
                        <b>{values?.bankAccountNo?.accountName}</b>
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
                        <b>{item?.strBankAccountName}</b>
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
                        {values?.bankAccountNo?.bankName}
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
                        {item?.strBankName}
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
                        {values?.bankAccountNo?.bankBranchName}
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
                        {item?.strBankBranchName}
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
                        {values?.bankAccountNo?.bankRouting}
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
                        <b>{item?.strRoutingNumber}</b>
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
                        <b>{values?.bankAccountNo?.bankAccNo}</b>
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
                        <b>{item?.strAccountNo}</b>
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
                        Akij House, 198 Bir Uttam Mir Shawkat Sarak, Tejgaon,
                        Dhaka-1208.
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
                        Akij House, 198 Bir Uttam Mir Shawkat Sarak, Tejgaon,
                        Dhaka-1208.
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
                        <b>{item?.strNaration}</b>
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
                        <b>{item?.strNaration}</b>
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
                        (i) NRB Remittance (ii) Domestic Remittance (iii) Salary
                        Payment (iv) Bill Payment (v) LC Payment (vi)
                        Warrant/Profit Payment
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
                        (i) Person to Person (ii) Person to Business (iii)
                        Business to Business (iv) Business to Customer (v)
                        Customer to Customer (vi) Financial Institute to
                        Financial Institute
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
                        <b>
                          {numberWithCommas((item?.numAmount || 0)?.toFixed(2))}
                        </b>
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
                      ></div>
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
                      ></div>
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
                        {numberWithCommas((item?.numAmount || 0)?.toFixed(2))}
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
                        <b>{amounts?.[index]} Taka Only</b>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p
              className="mt-5"
              style={{
                textTransform: "capitalize",
                fontSize: "14px",
              }}
            >
              {/* In Word: {adviceReportData.length > 0 && totalInWords} Taka Only */}
              Please send an RTGS credit instruction to {item?.strBankName}
            </p>
            <p>Yours Faithfully,</p>
            <p className="font-weight-bold" style={{ fontSize: "14px" }}>
              For {values?.bankAccountNo?.accountName}
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
            <p className="font-weight-bold" style={{ fontSize: "14px" }}>
              A/C No : {values?.bankAccountNo?.bankAccNo}
            </p>
            <div style={{ marginTop: "150px" }}>
              <b className="rtgs-address">
                {values?.bankAccountNo?.accountName}
              </b>
              <p className="rtgs-address">
                Akij House, 198 Bir Uttam Mir Shawkat Sarak,
              </p>
              <p className="rtgs-address">
                (Gulshan-Tejgaon Link Road),Tejgaon, Dhaka-1208.
              </p>
            </div>
          </div>
        ))}
    </>
  );
};
