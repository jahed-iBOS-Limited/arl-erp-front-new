import React, { useRef } from "react";
import { withRouter } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import { shallowEqual, useSelector } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import { _fixedPointVat } from "../../../../_helper/_fixedPointVat";
const GridData = ({ rowDto, loading, values }) => {
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const printRef = useRef();
  return (
    <>
      <div className="print_wrapper" componentRef={printRef} ref={printRef}>
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
              <h4 className="mb-3">Issue Summary</h4>
            </div>
          </div>
          <div className="col-lg-12 pr-0 pl-0">
            <table className="table table-striped table-bordered mt-3">
              <thead>
                <tr>
                  <th style={{ width: "47px" }}>SL</th>
                  <th style={{ width: "142px" }}>Date</th>
                  <th style={{ width: "330px" }}>Material Description</th>
                  <th style={{ width: "140px" }}>Quantity</th>
                  <th style={{ width: "140px" }}>Value</th>
                </tr>
              </thead>
              <tbody>
                {loading && <Loading />}
                {rowDto?.map((tableData, index) => (
                  <tr key={index}>
                    <td> {index + 1} </td>

                    <td>
                      {" "}
                      {values?.sortBy?.value === 2
                        ? "NaN"
                        : _dateFormatter(tableData?.date)}
                    </td>
                    <td>
                      {" "}
                      {values?.sortBy?.value === 1
                        ? "NaN"
                        : tableData?.taxItemGroupnName}
                    </td>
                    <td> {_fixedPointVat(tableData?.quantity, 3)}</td>
                    <td> {_fixedPointVat(tableData?.grandTotal)}</td>
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
