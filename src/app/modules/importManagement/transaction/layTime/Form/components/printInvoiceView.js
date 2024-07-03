import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../../chartering/_chartinghelper/images/print-icon.png";

export default function PrintInvoiceView() {
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
              <p style={{ marginLeft: "100px" }}> 30TH MAY, 2024</p>
            </div>
            <p>INVOICE REF: ACL/GRAIN FLOWER/MAY-02</p>
          </div>
          <div className="d-flex ">
            <p>TO</p>
            <div style={{ marginLeft: "115px" }}>
              <p>GRAIN FLOWER DMCC.</p>
              <p>
                UNIT NO-3705 HDS BUSINESS CENTER PLOT NO-JLT-PH1-M1A JUMEIRAH
              </p>
              <p> LAKES TOWERS DUBAI UNITED ARAB EMIRATES</p>
            </div>
          </div>
          <div className="d-flex ">
            <p>FROM</p>
            <div style={{ marginLeft: "94px" }}>
              <p>AKIJ COMMODITIES LIMITED</p>
              <p>
                198 AKIJ HOUSE BIR UTTAM MIR SHAWKAT SARAK (GULSHAN LINK ROAD
                TEJGAON) DHAKA
              </p>
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
                <span>:</span> M.V MALAK
              </p>
              <p>
                <span>:</span>KAVKAZ RUSSIA
              </p>
              <p>
                <span>:</span>CHATTOGRAM AND MONGLA SEA PORT, BANGLADESH
              </p>
              <p>
                <span>:</span>54,199.80 MT WHEAT IN BULK
              </p>
            </div>
          </div>
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
                  DESPATCH FOR UNLOADING PORT CHITTAGANG AND MONGLA SEA PORT,
                  BANGLADESH
                </td>
                <td style={styles.tableCell}>5.08</td>
                <td style={styles.tableCell}>12500</td>
                <td style={styles.tableCell}>63,445.00</td>
              </tr>
              <tr>
                <td colSpan={4}>
                  <p>NET PAYABLE</p>
                </td>
                <td>63,445.00 </td>
              </tr>
              <tr>
                <td colSpan={5}>
                  <p>
                    IN WORDS USD: SIXTY THREE THOUSAND FOUR HUNDRED FORTY FIVE
                    ONLY
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
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
                  <span>:</span> AKIJ COMMODITIES LIMITED
                </p>
                <p>
                  <span>:</span>1201000109470
                </p>
                <p>
                  <span>:</span>JAMUNA BANK LTD
                </p>
                <p>
                  <span>:</span>GULSHAN CORPORATE, DHAKA BANGLADESH
                </p>
                <p>
                  <span>:</span>JAMUBDDH057
                </p>
              </div>
            </div>
          </div>
          <div>
            <p style={{ marginTop: "50px", marginBottom: "-5px" }}>
              FOR AND ON BEHALF OF AKIJ COMMODITIES LTD
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
