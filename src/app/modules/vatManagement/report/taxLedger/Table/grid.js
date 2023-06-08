import React, { useRef } from "react";
import { withRouter } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
const GridData = ({ loading, singleData, values }) => {
  // const claculator = (arr, key) => {
  //   const total = arr?.reduce((acc, cur) => (acc += cur?.[key]), 0);
  //   return total;
  // };
  const printRef = useRef();
  let PClosing = 0;

  // total Calculations
  let treasuryDepositTatal = 0;
  let rebateTatal = 0;
  let otherAdjustmentTatal = 0;
  let payableTatal = 0;

  return (
    <>
      <div componentRef={printRef} ref={printRef} className="print_wrapper">
        <div className="row global-table">
          <div className="col-lg-12 text-right printSectionNone">
            <ReactToPrint
              trigger={() => (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ padding: "2px 5px" }}
                >
                  <img
                    style={{
                      width: "25px",
                      paddingRight: "5px",
                    }}
                    src={printIcon}
                    alt="print-icon"
                  />
                  Print
                </button>
              )}
              content={() => printRef.current}
            />
          </div>
          <div className="col-lg-12">
            <div className="report_top mt-5 d-flex flex-column justify-content-center align-items-center">
              <p className="mb-1">
                Government of the People's Republic of Bangladesh
              </p>
              <p className="mb-1">National Board of Revenue</p>
              <h1 className="mb-1">Current Register</h1>
              <p className="mb-1">[Discribed in rule 22(1)]</p>
            </div>
          </div>
          <div className="col-lg-12 d-flex justify-content-between">
            <div className="createNoteReportLeft">
              <p>
                <strong>VAT Registration NO: </strong>
                {singleData?.objHeader?.vatRegNo}
              </p>
              <p>
                <strong>Name: </strong>
                {singleData?.objHeader?.name}
              </p>
              <p className="mb-1">
                <strong>Address: </strong>
                {singleData?.objHeader?.address}
              </p>
              <p>
                <strong>Phone:</strong>
              </p>
            </div>
            <div className="createNoteReportRight">
              <p>
                <strong>Date: {values?.date}</strong>
              </p>
            </div>
          </div>

          <div className="col-lg-12 pr-0 pl-0">
            <table className="table table-striped table-bordered mt-3">
              <thead>
                <tr>
                  <th style={{ width: "35px" }}>S/N</th>
                  <th style={{ width: "200px" }}>Date</th>
                  <th style={{ width: "200px" }}>Transaction Description</th>
                  <th style={{ width: "200px" }}>Purchase/Sales Serial</th>
                  <th style={{ width: "200px" }}>Register Date</th>
                  <th style={{ width: "200px" }}>Treasury Deposit</th>
                  <th style={{ width: "200px" }}>Rebate</th>
                  <th style={{ width: "200px" }}>Other Adjustment</th>
                  <th style={{ width: "200px" }}>Payable</th>
                  <th style={{ width: "200px" }}>Closing Balance</th>
                  <th style={{ width: "200px" }}>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {loading && <Loading />}
                {singleData?.objRow?.map((tableData, index) => {
                  const treasuryDeposit =
                    tableData?.transactionTypeId === 10 ? tableData?.amount : 0;
                  const rebate =
                    tableData?.transactionTypeId === 1 ? tableData?.amount : 0;
                  const otherAdjustment =
                    tableData?.transactionTypeId === 11 ? tableData?.amount : 0;
                  const payable =
                    tableData?.transactionTypeId === 8 ? tableData?.amount : 0;
                  // closingAmount total
                  const closingAmount =
                    treasuryDeposit +
                    rebate -
                    (otherAdjustment + payable) +
                    PClosing;
                  // PClosing asign
                  PClosing = closingAmount;

                  // total Calculations
                  treasuryDepositTatal += treasuryDeposit;
                  rebateTatal += rebate;
                  otherAdjustmentTatal += otherAdjustment;
                  payableTatal += payable;

                  return (
                    <tr key={index}>
                      <td> {index + 1} </td>
                      <td> {_dateFormatter(tableData?.transactionDate)} </td>
                      <td> {tableData?.transactionCode} </td>
                      <td>
                        {" "}
                        {tableData?.salesId <= 0
                          ? tableData?.purchaseId
                          : tableData?.salesId}{" "}
                      </td>
                      <td> {_dateFormatter(tableData?.transactionDate)} </td>
                      <td> {treasuryDeposit?.toFixed(2)} </td>
                      <td> {rebate?.toFixed(2)}</td>
                      <td> {otherAdjustment?.toFixed(2)} </td>
                      <td> {payable?.toFixed(2)} </td>
                      <td> {closingAmount?.toFixed(2)} </td>
                      <td> {} </td>
                    </tr>
                  );
                })}
                <tr>
                  <td colspan="5" style={{ textAlign: "left !important" }}>
                    Total Amount:
                  </td>
                  <td>{treasuryDepositTatal?.toFixed(2)}</td>
                  <td>{rebateTatal?.toFixed(2)}</td>
                  <td>{otherAdjustmentTatal?.toFixed(2)}</td>
                  <td>{payableTatal?.toFixed(2)}</td>
                  <td>{PClosing?.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-lg-12 mt-6"></div>
      </div>
    </>
  );
};

export default withRouter(GridData);
