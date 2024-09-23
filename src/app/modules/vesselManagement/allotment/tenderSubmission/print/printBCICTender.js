import React from "react";
import { _dateFormatterTwo } from "../../../../_helper/_dateFormate";
import "./style.css";
import { convertToText } from "../helper";

const PrintBCICTender = ({ tenderDetails: { header, rows } }) => {
  // first data
  const firstDataOnTable = rows?.length > 0 && rows[0];
  const secondDataOnTable = rows?.length > 1 && rows[1];
  const thirdDataOnTable = rows?.length > 2 && rows[2];
  const fourthDataOnTable = rows?.length > 3 && rows[3];

  // last half data on table
  const restofDataOnTable = rows?.length > 4 ? rows?.slice(4) : [];

  return (
    <div className="print-only">
      <div style={{ textAlign: "center", padding: "10px 0" }}>
        <h2>SCHEDULE OF THE PRICE</h2>
        <small>
          QUOTATION ENQUIRY NO: {header?.enquiryNo} (DUE FOR SUBMISSION:{" "}
          {_dateFormatterTwo(header?.submissionDate)})
        </small>
      </div>
      {rows?.length > 0 && (
        <table style={{ margin: "20px 0" }}>
          <thead style={{ padding: "10px 0" }}>
            <tr>
              <th colSpan={6} style={{ textAlign: "center" }}>
                DESCRIPTION OF ITEM
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ width: "100%" }}>
              <td
                rowSpan={2}
                colspan={2}
                style={{ width: "30%", textAlign: "left" }}
              >
                <strong style={{ display: "block" }}>PART – A</strong>{" "}
                <strong style={{ display: "block" }}>(FOREIGN PART)</strong>{" "}
                TRANSPORTATION OF {header?.foreignQty} MT (+/-10%){" "}
                {header?.itemName} IN SINGLE SHIPMENT FROM{" "}
                {header?.loadPortName} TO {header?.dischargePortName} PORT,
                BANGLADESH ({header?.laycan})
              </td>
              <td colSpan={4}>
                <strong style={{ display: "block" }}>PART – B</strong>{" "}
                <strong style={{ display: "block" }}>
                  (LOCAL TRANSPORTATION)
                </strong>{" "}
                TRANSPORTATION OF {header?.foreignQty} MT (+/-10%){" "}
                {header?.itemName} FROM MOTHER VESSEL AT OUTER ANCHORAGE OF{" "}
                {header?.dischargePortName} PORT AND DELIVER IN 50 KG NET BAG AT
                BELOW MENTION BUFFER / FACTORY GODOWNS:
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: "bold", textAlign: "center" }}>
                Name of Factory
              </td>
              <td style={{ fontWeight: "bold", textAlign: "center" }}>
                PERCENTAGE (%) OF QUANTITY (BASIS B/L QUANTITY)
              </td>
              <td style={{ fontWeight: "bold", textAlign: "center" }}>
                PRICE PER M. TON IN BDT.
              </td>
              <td style={{ fontWeight: "bold", textAlign: "center" }}>
                PRICE PER M. TON IN WORDS BDT.
              </td>
            </tr>

            {/* First Data */}
            <tr>
              <td colSpan={2}>PRICE PER M.TON IN USD</td>
              <td style={{ textAlign: "left" }}>
                {firstDataOnTable?.godownName || ""}
              </td>
              <td
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  width: "100px",
                }}
              >
                {firstDataOnTable?.quantity || ""}
              </td>
              <td
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  width: "100px",
                }}
              >
                {firstDataOnTable?.perQtyTonPriceBd || ""}
              </td>
              <td style={{ textAlign: "center" }}>
                {firstDataOnTable?.perQtyPriceWords || ""}
              </td>
            </tr>

            {/* Second Data */}
            <tr>
              <td colSpan={2} height={!header?.foreignPriceUsd && 30}>
                {header?.foreignPriceUsd ? `${header?.foreignPriceUsd} $` : ""}
              </td>
              <td style={{ textAlign: "left" }}>
                {secondDataOnTable?.godownName || ""}
              </td>
              <td
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  width: "100px",
                }}
              >
                {secondDataOnTable?.quantity || ""}
              </td>
              <td
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  width: "100px",
                }}
              >
                {secondDataOnTable?.perQtyTonPriceBd
                  ? secondDataOnTable?.perQtyTonPriceBd
                  : ""}
              </td>
              <td style={{ textAlign: "center" }}>
                {secondDataOnTable?.perQtyPriceWords || ""}
              </td>
            </tr>

            {/* Third Data */}
            <tr>
              <td colSpan={2}>PRICE PER M. TON IN WORDS</td>
              <td style={{ textAlign: "left" }}>
                {thirdDataOnTable?.godownName || ""}
              </td>
              <td
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  width: "100px",
                }}
              >
                {thirdDataOnTable?.quantity || ""}
              </td>
              <td
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  width: "100px",
                }}
              >
                {thirdDataOnTable?.perQtyTonPriceBd || ""}
              </td>
              <td style={{ textAlign: "center" }}>
                {thirdDataOnTable?.perQtyPriceWords || ""}
              </td>
            </tr>

            {/* Fourth Data */}
            <tr>
              <td colSpan={2} height={!header?.foreignPriceUsd && 80}>
                {header?.foreignPriceUsd
                  ? convertToText(header?.foreignPriceUsd, "USD")
                  : ""}
              </td>
              <td style={{ textAlign: "left" }}>
                {fourthDataOnTable?.godownName || ""}
              </td>
              <td
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  width: "100px",
                }}
              >
                {fourthDataOnTable?.quantity || ""}
              </td>
              <td
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  width: "100px",
                }}
              >
                {fourthDataOnTable?.perQtyTonPriceBd || ""}
              </td>
              <td style={{ textAlign: "center" }}>
                {fourthDataOnTable?.perQtyPriceWords || ""}
              </td>
            </tr>

            {restofDataOnTable?.length > 0 &&
              restofDataOnTable?.map((item, index) => {
                return (
                  <tr>
                    {index === 0 && (
                      <td rowSpan={restofDataOnTable.length} colSpan={2}></td>
                    )}
                    <td style={{ textAlign: "left" }}>{item?.godownName}</td>
                    <td
                      style={{
                        textAlign: "right",
                        fontWeight: "bold",
                        width: "100px",
                      }}
                    >
                      {item?.quantity}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontWeight: "bold",
                        width: "100px",
                      }}
                    >
                      {item?.perQtyTonPriceBd}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {item?.perQtyPriceWords}
                    </td>
                  </tr>
                );
              })}
            <tr height={500}>
              <td colSpan={3}>
                <span style={{ display: "block", marginBottom: "20px" }}>
                  QUOTATION ENQUIRY NO:
                </span>
                <span className="text-center d-block">
                  REF. {header?.referenceNo} DATED:{" "}
                  {_dateFormatterTwo(header?.referenceDate)}
                </span>
                <span className="text-center d-block">
                  COMC-
                  {header?.commercialNo}, DATED:{" "}
                  {_dateFormatterTwo(header?.commercialDate)}
                </span>
              </td>
              <td
                colSpan={3}
                style={{
                  verticalAlign: "baseline",
                  textAlign: "center",
                  paddingTop: "20px",
                }}
              >
                Name and Address of the PROPRIETOR
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PrintBCICTender;
