import React from "react";
import { _dateFormatterTwo } from "../../../../_helper/_dateFormate";
import "./style.css";
import { convertToText } from "../helper";

const PrintBCICTender = ({ tenderDetails: { header, rows } }) => {
  const firstDataOnTable = rows?.length > 0 && rows[0];
  const firstHalfDataOnTable =
    rows?.length > 0 && rows?.slice(1, Math.floor(rows?.length / 2));
  const lastHalfDataOnTable =
    rows?.length > 0 &&
    rows?.length !== 1 &&
    rows?.slice(Math.floor(rows?.length / 2));

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
                BANGLADESH (FREE IN & LINER OUT BASIS)
              </td>
              <td colSpan={4}>
                <strong style={{ display: "block" }}>PART – B</strong>{" "}
                <strong style={{ display: "block" }}>
                  (LOCAL TRANSPORTATION)
                </strong>{" "}
                TRANSPORTATION OF {header?.foreignQty} MT
                (+/-10%) {header?.itemName} FROM MOTHER VESSEL AT OUTER
                ANCHORAGE OF {header?.dischargePortName} PORT AND DELIVER IN 50
                KG NET BAG AT BELOW MENTION BUFFER / FACTORY GODOWNS:
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
            <tr>
              <td colSpan={2}>PRICE PER M.TON IN USD</td>
              <td style={{ textAlign: "left" }}>
                {firstDataOnTable?.godownName}
              </td>
              <td
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  width: "100px",
                }}
              >
                {firstDataOnTable?.quantity}
              </td>
              <td
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  width: "100px",
                }}
              >
                {firstDataOnTable?.perQtyTonPriceBd}
              </td>
              <td style={{ textAlign: "center" }}>
                {firstDataOnTable?.perQtyPriceWords}
              </td>
            </tr>
            {!firstHalfDataOnTable?.length && (
              <>
                <tr>
                  <td colSpan={2}></td>
                  <td colspan={4} style={{ borderBottom: 0 }}></td>
                </tr>
                <tr>
                  <td colSpan={2}></td>
                  <td colspan={4}></td>
                </tr>
              </>
            )}
            {firstHalfDataOnTable?.map((item, index) => {
              return (
                <>
                  <tr>
                    {index === 0 && (
                      <>
                        <td
                          rowSpan={firstHalfDataOnTable.length}
                          colSpan={2}
                        >{header?.foreignPriceUsd}</td>
                      </>
                    )}
                    <>
                      <td
                        style={{ textAlign: "left" }}
                        rowSpan={!firstDataOnTable ? 2 : 1}
                      >
                        {item?.godownName}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontWeight: "bold",
                          width: "100px",
                        }}
                        rowSpan={!firstDataOnTable ? 2 : 1}
                      >
                        {item?.quantity}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontWeight: "bold",
                          width: "100px",
                        }}
                        rowSpan={!firstDataOnTable ? 2 : 1}
                      >
                        {item?.perQtyTonPriceBd}
                      </td>
                      <td
                        style={{ textAlign: "center" }}
                        rowSpan={!firstDataOnTable ? 2 : 1}
                      >
                        {item?.perQtyPriceWords}
                      </td>
                    </>
                  </tr>
                </>
              );
            })}
            {lastHalfDataOnTable &&
              lastHalfDataOnTable?.map((item, index) => {
                return (
                  <>
                    <tr>
                      {index === 0 && (
                        <>
                          <td
                            rowSpan={lastHalfDataOnTable.length}
                            colSpan={2}
                          >{convertToText(header?.foreignPriceUsd, 'USD')}</td>
                        </>
                      )}
                      <>
                        <td style={{ textAlign: "left" }}>
                          {item?.godownName}
                        </td>
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
                      </>
                    </tr>
                  </>
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
                  paddingTop: "20px"
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
