import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { amountToWords } from "../../../../_helper/_ConvertnumberToWord";
import { _todayDate } from "../../../../_helper/_todayDate";
import { _todayDayWeekName, currentMonthAndYear, dateFormatWithMonthName } from "../../../../_helper/_dateFormate";

export default function Print({ selectedRow, currentSelectedAccNo }) {
  const {
    // eslint-disable-next-line no-unused-vars
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId, label: buName, businessUnitAddress },
  } = useSelector((state) => state.authData, shallowEqual);

  const [businessUnitTaxInfo, getBusinessUnitTaxInfo] = useAxiosGet();

  useEffect(() => {
    const apiURL = `/fino/PaymentRequest/GetBusinessUnitTaxInfo?BusinessUnitId=${buId}`;
    getBusinessUnitTaxInfo(apiURL);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  const total = selectedRow.reduce((sum, item) => sum + item.tdsamount, 0);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        margin: 0,
        padding: 20,
      }}
      contenteditable="true"
    >
      <div style={{ marginBottom: 20 }}>Date: {_todayDayWeekName()}, {dateFormatWithMonthName(_todayDate())}</div>
      <div style={{ marginBottom: 20 }}>
        <p>To,</p>
        <p>
          The Manager
          <br />
          ISLAMI BANK BANGLADESH LTD.
          <br />
          Head Office Complex Branch, 40 Dilkusha, C/A, Dhaka-1000
        </p>
      </div>
      <div style={{ marginBottom: 20 }}>
        <p>
          <strong>Subject: Payment to the Govt. By B.Bank Challan</strong>
        </p>
      </div>
      <div style={{ marginBottom: 20 }}>
        <p>Dear Sir,</p>
        <p>
          We do hereby request you to make payment by Bangladesh Bank Challan as
          per below table debiting the total amounts to our CD Account No.{" "}
          {currentSelectedAccNo?.bankAccNo || 'Not Assigned'}
        </p>
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: 20,
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: 8 }}>SL</th>
            <th style={{ border: "1px solid black", padding: 8 }}>
              In favor of the Govt. Agency (The money is being deposited)
            </th>
            <th style={{ border: "1px solid black", padding: 8 }}>
              Through whom it was given (Name and address of the person)
            </th>
            <th style={{ border: "1px solid black", padding: 8 }}>
              On whose behalf the money was paid (Name / Tin/ BIN and address of
              the person / organization)
            </th>
            <th style={{ border: "1px solid black", padding: 8 }}>
              Challan no.
            </th>
            <th style={{ border: "1px solid black", padding: 8 }}>
              Details of what was submitted
            </th>
            <th style={{ border: "1px solid black", padding: 8 }}>
              Deposited amounts
            </th>
          </tr>
        </thead>
        <tbody>
          {selectedRow?.map((item, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid black", padding: 8 }}>
                {index + 1}
              </td>
              <td
                style={{
                  border: "1px solid black",
                  padding: 8,
                  textAlign: index > 0 ? "center" : "left",
                }}
              >
                {index === 0
                  ? [4].includes(buId)
                    ? "LTU-Dhaka"
                    : businessUnitTaxInfo?.strTaxCircle
                  : `" "`}
              </td>
              <td
                style={{
                  border: "1px solid black",
                  padding: 8,
                  textAlign: index > 0 ? "center" : "left",
                }}
              >
                {index === 0 ? (
                  <>
                    {buName}. {businessUnitAddress}
                    <br />
                    Tin: {businessUnitTaxInfo?.strTinNo}
                  </>
                ) : (
                  `" "`
                )}
              </td>
              <td
                style={{
                  border: "1px solid black",
                  padding: 8,
                  textAlign: index > 0 ? "center" : "left",
                }}
              >
                {index === 0 ? (
                  <>
                    {item?.partnerName}
                    <br />
                    {item?.strTin}
                    <br />
                    {item?.strBusinessPartnerAddress}
                  </>
                ) : (
                  `" "`
                )}
              </td>
              <td
                style={{
                  border: "1px solid black",
                  padding: 8,
                  textAlign: index > 0 ? "center" : "left",
                }}
              >
                {index === 0 ? "(As per your serial)" : `" "`}
              </td>
              <td
                style={{
                  border: "1px solid black",
                  padding: 8,
                  textAlign: index > 0 ? "center" : "left",
                }}
              >
                {index === 0 ? "TDS of Suppliers' bill payment" : `" "`}
              </td>

              <td
                style={{
                  border: "1px solid black",
                  padding: 8,
                }}
              >
                {item?.tdsamount}
              </td>
            </tr>
          ))}
          <tr>
            <td style={{ border: "1px solid black", padding: 8 }} colSpan={6}>
              Total (No. of Set:{selectedRow?.length})
            </td>
            <td style={{ border: "1px solid black", padding: 8 }}>{total}</td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginBottom: 20 }}>
        <p>Other Information:</p>
        <p>
          Financial Year: 2025-26
          <br />
          As per Act: SECTION 89
          <br />
          Old Challan Code: 1110223103258
          <br />
          Depositing Month: For The Month {currentMonthAndYear()}
        </p>
      </div>
      <div style={{ marginBottom: 20 }}>
        <p>
          Kindly look into this matter and debit our account as early as
          possible.
        </p>
      </div>
      <div style={{ marginBottom: 20 }}>
        <p>In Word: {amountToWords(total)}</p>
      </div>
      <div>
        <p>Yours faithfully,</p>
        <p>FOR {buName?.toUpperCase()}</p>
        <div style={{ display: 'flex', flexFlow: 'row wrap', columnGap: '80px', marginTop: "60px" }}>
          <p>Authorized Signature</p>
          <p>Authorized Signature</p>
        </div>
      </div>
    </div>
  );
}
