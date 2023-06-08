import React, { useRef } from "react";
import { withRouter } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import { shallowEqual, useSelector } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
const GridData = ({ rowDto, loading }) => {
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const printRef = useRef();
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
              <h4>{selectedBusinessUnit?.label}</h4>
              <h5 className="mb-3">Tresuary Deposit Summary</h5>
            </div>
          </div>
          <div className="col-lg-12 pr-0 pl-0">
            <table className="table table-striped table-bordered mt-3">
              <thead>
                <tr>
                  <th style={{ width: "35px" }}>SL</th>
                  <th style={{ width: "70px" }}>ID</th>
                  <th style={{ width: "100px" }}>Type</th>
                  <th style={{ width: "100px" }}>Code</th>
                  <th style={{ width: "100px" }}>Date</th>
                  <th style={{ width: "100px" }}>TrChallan</th>
                  <th style={{ width: "100px" }}>Deposit Amount</th>
                </tr>
              </thead>
              <tbody>
                {loading && <Loading />}
                {rowDto?.map((tableData, index) => (
                  <tr key={index}>
                    <td> {index + 1} </td>
                    <td>{tableData?.intTreasuryDepositTypeId}</td>
                    <td>{tableData?.intTreasuryDepositTypeName}</td>
                    <td> {tableData?.strTresuaryCode}</td>
                    <td> {_dateFormatter(tableData?.dteDepositDate)}</td>
                    <td> {tableData?.strTrChallanNo}</td>
                    <td className="text-right">
                      <div className="pr-2">{tableData?.monAmount}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(GridData);
