import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../../chartering/_chartinghelper/images/print-icon.png";
import { shallowEqual, useSelector } from "react-redux";
import moment from "moment";
import { _formatMoney } from "../../../../../_helper/_formatMoney";
import { amountToWords } from "../../../../../_helper/_ConvertnumberToWord";

export default function PrintInvoiceView({ debitData = {} }) {
  const print = useRef();
  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      lineHeight: "1.5",
      margin: "20px auto",
      padding: "20px",
      maxWidth: "800px",
      border: "1px solid #ccc",
    },
    heading: {
      textAlign: "center",
      textDecoration: "underline",
      margin: "20px 0",
    },

    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px",
      textAlign: "center",
    },
    tableCell: {
      padding: "8px",
      textAlign: "center",
    },

    bankDetails: {
      marginTop: "20px",
    },
  };
  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  return (
    <div>
      <div className="text-right mr-5">
        <ReactToPrint
          pageStyle={
            "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
          }
          trigger={() => (
            <button type="button" className={"btn btn-primary px-3 py-2 my-4"}>
              <img
                style={{ width: "25px", paddingRight: "5px" }}
                src={printIcon}
                alt="print-icon"
              />
              Print
            </button>
          )}
          content={() => print.current}
        />
      </div>
      <div ref={print} style={{ padding: "20px" }}>
        <div style={styles.container}>
          <h1 style={styles.heading}>DEBIT NOTE</h1>
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <p>DATE</p>
              <p style={{ marginLeft: "100px" }}>
                {" "}
                {moment(debitData?.objHeader?.loadingCompleted)?.format("ll")}
              </p>
            </div>
            <p>INVOICE REF: ACL/GRAIN FLOWER/MAY-02</p>
          </div>
          <div className="d-flex ">
            <p>TO</p>
            <div style={{ marginLeft: "115px" }}>
              <p>{debitData?.objHeader?.stackHolderName}</p>
              <p>{debitData?.objHeader?.stackHolderAddress}</p>
              <p> {debitData?.objHeader?.stackHolderAddress}</p>
            </div>
          </div>
          <div className="d-flex ">
            <p>FROM</p>
            <div style={{ marginLeft: "94px" }}>
              <p>{selectedBusinessUnit?.label}</p>
              <p>{selectedBusinessUnit?.businessUnitAddress}</p>
            </div>
          </div>
          <div className="d-flex ">
            <div>
              <p>VESSEL &amp; VOYAGE</p>
              <p>LOAD PORT </p>
              <p>DISCHARGE PORT</p>
              <p>BL QTY</p>
            </div>
            <div style={{ marginLeft: "50px" }}>
              <p>
                <span>:</span> {debitData?.objHeader?.vesselName}{" "}
                {debitData?.objHeader?.voyageNo}
              </p>
              <p>
                <span>:</span>
                {debitData?.objHeader?.berthedPortCountry}
              </p>
              <p>
                <span>:</span>
                {debitData?.objHeader?.berthedPortName}
              </p>
              <p>
                <span>:</span>
                {debitData?.objHeader?.cargoQty}{" "}
                {debitData?.objHeader?.cargoName}
              </p>
            </div>
          </div>
          {debitData?.objRow?.length > 0 ? (
            <table className="table" style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableCell}>SL</th>
                  <th style={styles.tableCell}>PARTICULARS</th>
                  <th style={styles.tableCell}>TOTAL TIME/DAY</th>
                  <th style={styles.tableCell}>RATE USD/DAY</th>
                  <th style={styles.tableCell}>TOTAL AMOUNT USD</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td style={styles.tableCell}>1</td>
                  <td style={styles.tableCell}>
                    DESPATCH FOR UNLOADING PORT{" "}
                    {debitData?.objHeader?.berthedPortName}
                  </td>
                  <td style={styles.tableCell}>
                    {debitData?.objHeader?.totalUsedDay}
                  </td>
                  <td style={styles.tableCell}>
                    {debitData?.objHeader?.despatchRate}
                  </td>
                  <td style={styles.tableCell}>
                    {+debitData?.objHeader?.despatchRate *
                      +debitData?.objHeader?.totalUsedDay}
                  </td>
                </tr>
                <tr>
                  <td colSpan={4}>
                    <p>NET PAYABLE</p>
                  </td>
                  <td>
                    {+debitData?.objHeader?.despatchRate *
                      +debitData?.objHeader?.totalUsedDay}{" "}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5}>
                    <p>
                      {amountToWords(
                        +debitData?.objHeader?.despatchRate *
                          +debitData?.objHeader?.totalUsedDay
                      )}{" "}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : null}
          <div style={styles.bankDetails}>
            <div className="d-flex ">
              <div>
                <p style={{ marginTop: "35px" }}>BENEFICIARY NAME</p>
                <p>ACCOUNT NUMBER </p>
                <p>BANK NAME</p>
                <p>BRANCH</p>
                <p>SWIFT CODE</p>
              </div>
              <div style={{ marginLeft: "50px" }}>
                <p>BANK DETAILS:</p>
                <p>
                  <span>:</span> {debitData?.bPbankInfo?.bankAccountName}
                </p>
                <p>
                  <span>:</span>
                  {debitData?.bPbankInfo?.bankAccountNumber}
                </p>
                <p>
                  <span>:</span>
                  {debitData?.bPbankInfo?.bankName}
                </p>
                <p>
                  <span>:</span>
                  {debitData?.bPbankInfo?.branchName}
                </p>
                <p>
                  <span>:</span>
                  {debitData?.bPbankInfo?.swiftCode}
                </p>
              </div>
            </div>
          </div>
          <div>
            <p style={{ marginTop: "50px", marginBottom: "-5px" }}>
              FOR AND ON BEHALF OF {selectedBusinessUnit?.label?.toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
