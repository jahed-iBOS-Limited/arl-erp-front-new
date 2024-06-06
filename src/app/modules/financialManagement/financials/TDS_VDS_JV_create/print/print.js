import React from "react";

export default function Print() {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        margin: 0,
        padding: 20,
      }}
    >
      <div style={{marginBottom: 20 }}>
        Date: Wednesday, June 05, 2024
      </div>
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
          per below table debiting the total amounts to our CD Account No.
          20502130100077310
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
          <tr>
            <td style={{ border: "1px solid black", padding: 8 }}>1</td>
            <td style={{ border: "1px solid black", padding: 8 }}>LTU-Dhaka</td>
            <td style={{ border: "1px solid black", padding: 8 }}>
              AKIJ CEMENT COMPANY LTD. Address: 198 Bir Uttam Mir Sawkat Sarak,
              Tejgaon Dhaka 1208
              <br />
              Tin: 451199230926
            </td>
            <td style={{ border: "1px solid black", padding: 8 }}>
              MEGHNA PETROLEUM LIMITED
              <br />
              369107259995
              <br />
              Address:58/59, Agrabad C/A, Chattogram
            </td>
            <td style={{ border: "1px solid black", padding: 8 }}>
              (As per your serial)
            </td>
            <td style={{ border: "1px solid black", padding: 8 }}>
              TDS of Suppliers' bill payment
            </td>
            <td style={{ border: "1px solid black", padding: 8 }}>5,674</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: 8 }}>2</td>
            <td style={{ border: "1px solid black", padding: 8 }}>" " " " "</td>
            <td style={{ border: "1px solid black", padding: 8 }}>" " " " "</td>
            <td style={{ border: "1px solid black", padding: 8 }}>" " " " "</td>
            <td style={{ border: "1px solid black", padding: 8 }}>" " " " "</td>
            <td style={{ border: "1px solid black", padding: 8 }}>" " " " "</td>
            <td style={{ border: "1px solid black", padding: 8 }}>5,674</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: 8 }} colSpan={6}>
              Total (No. of Set:24)
            </td>
            <td style={{ border: "1px solid black", padding: 8 }}>136,176</td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginBottom: 20 }}>
        <p>Other Information:</p>
        <p>
          Financial Year: 2023-24
          <br />
          As per Act: SECTION 89
          <br />
          Old Challan Code: 1110223103258
          <br />
          Depositing Month: For The Month Nov 23
        </p>
      </div>
      <div style={{ marginBottom: 20 }}>
        <p>
          Kindly look into this matter and debit our account as early as
          possible.
        </p>
      </div>
      <div style={{ marginBottom: 20 }}>
        <p>
          In Word: One lac Thirty Six Thousand One Hundred Seventy Six Only.
        </p>
      </div>
      <div>
        <p>Yours faithfully,</p>
        <p>FOR AKIJ CEMENT COMPANY LIMITED</p>
        <p>Authorized Signature</p>
      </div>
    </div>
  );
}
