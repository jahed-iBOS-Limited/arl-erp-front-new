import React, { useRef } from "react";
import { withRouter } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import printIcon from "./../../../../_helper/images/print-icon.png";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import { _fixedPointVat } from './../../../../_helper/_fixedPointVat';
const GridData = ({ rowDto, values }) => {
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const printRef = useRef();

  const toatalCalculationFunc = (arr, name) => {
    const result = arr?.reduce((acc, cur) => acc + +cur?.[name], 0);
    return result;
  };
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
            <div className="report_top mt-5 d-flex flex-column justify-content-center align-items-center text-uppercase">
              <h4>{selectedBusinessUnit?.label}</h4>
              <h4 className="mb-3">Sales Summary</h4>
            </div>
          </div>
          <div className="col-lg-12 pr-0 pl-0 purchaseRegistrationTable">
            <table className="table table-striped table-bordered mt-3">
              <thead>
                <tr>
                  <th style={{ width: "38px" }}>SL</th>

                  <th style={{ width: "100px" }}>Challan/Boe No</th>
                  {values?.sortBy?.value === 1 && (
                    <th style={{ width: "100px" }}>Challan/Boe Date</th>
                  )}
                  {values?.sortBy?.value === 2 && (
                    <th style={{ width: "50px" }}>HS.code</th>
                  )}
                  {values?.sortBy?.value === 2 && (
                    <th style={{ width: "200px" }}>Product Name</th>
                  )}
                  {values?.sortBy?.value === 3 && (
                    <th style={{ width: "50px" }}>Trade Type</th>
                  )}

                  {values?.sortBy?.value === 4 && (
                    <th style={{ width: "50px" }}>Customer Name</th>
                  )}
                  <th style={{ width: "100px" }}>Quantity</th>
                  <th style={{ width: "100px" }}>Without SD/VAT</th>
                  <th style={{ width: "100px" }}>SD Amount</th>
                  <th style={{ width: "100px" }}>VAT Amount</th>
                  <th style={{ width: "100px" }}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {rowDto?.map((tableData, index) => (
                  <tr key={index}>
                    <td> {index + 1} </td>
                    <td> {"All Challan"}</td>
                    {values?.sortBy?.value === 1 && (
                      <td> {_dateFormatter(tableData?.date)}</td>
                    )}
                    {values?.sortBy?.value === 2 && (
                      <td> {tableData?.hsCode}</td>
                    )}
                    {values?.sortBy?.value === 2 && (
                      <td> {tableData?.taxItemGroupnName}</td>
                    )}
                    {values?.sortBy?.value === 3 && (
                      <td> {tableData?.tradeTypeName}</td>
                    )}
                    {values?.sortBy?.value === 4 && (
                      <td> {tableData?.customerName}</td>
                    )}
                    <td className="text-right"> {_fixedPointVat(tableData?.quantity, 3)}</td>
                    <td className="text-right"> {_fixedPointVat(tableData?.amount)}</td>
                    <td className="text-right"> {_fixedPointVat(tableData?.sdTotal)}</td>
                    <td className="text-right"> {_fixedPointVat(tableData?.vatTotal)}</td>
                    <td className="text-right">{_fixedPointVat(tableData?.grandTotal)}</td>
                  </tr>
                ))}
                <tr>
                  <td
                    colspan={
                      values?.sortBy?.value === 1
                        ? 3
                        : values?.sortBy?.value === 2
                        ? 4
                        : 3
                    }
                    className="text-right"
                  >
                    <b>Total:</b>
                  </td>
                  <td className="text-right">
                    <b>
                      {" "}
                      {toatalCalculationFunc(rowDto, "quantity")?.toFixed(3)}
                    </b>
                  </td>
                  <td className="text-right">
                    <b>
                      {" "}
                      {toatalCalculationFunc(rowDto, "amount")?.toFixed(2)}
                    </b>
                  </td>
                  <td className="text-right">
                    <b>
                      {" "}
                      {toatalCalculationFunc(rowDto, "sdTotal")?.toFixed(2)}
                    </b>
                  </td>
                  <td className="text-right">
                    <b>
                      {" "}
                      {toatalCalculationFunc(rowDto, "vatTotal")?.toFixed(2)}
                    </b>
                  </td>
                  <td className="text-right">
                    <b>
                      {" "}
                      {toatalCalculationFunc(rowDto, "grandTotal")?.toFixed(2)}
                    </b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default withRouter(GridData);
