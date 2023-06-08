import React, { useRef } from "react";
import { withRouter } from "react-router-dom";

import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import { _fixedPointVat } from "../../../../_helper/_fixedPointVat";

const GridData = ({ rowDto, values }) => {
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const printRef = useRef();

  const total = {
    totalQuantity: 0,
    totalWithOutSdVat: 0,
    totalCdAmount: 0,
    totalRdAmount: 0,
    totalSdAmount: 0,
    totalVatAmount: 0,
    totalAitAmount: 0,
    totalAtAmount: 0,
    grandTotal: 0,
  };

  const totalCalculation = (tableData) => {
    total.totalQuantity += tableData?.quantity;
    total.totalWithOutSdVat += tableData?.amount;
    total.totalCdAmount += tableData?.cdTotal;
    total.totalRdAmount += tableData?.rdTotal;
    total.totalSdAmount += tableData?.sdTotal;
    total.totalVatAmount += tableData?.vatTotal;
    total.totalAitAmount += tableData?.aitTotal;
    total.totalAtAmount += tableData?.atvTotal;
    total.grandTotal += tableData?.grandTotal;
  };
  const sortBy = values?.sortBy?.value;

  return (
    <>
      <div componentRef={printRef} ref={printRef} className="print_wrapper">
        <div className="row global-table purchaseRegistration">
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
              <h4 className="mb-3">Purchase Summary</h4>
            </div>
          </div>
          <div className="col-lg-12 pr-0 pl-0 purchaseRegistrationTable">
            {/*  */}
            {sortBy === 1 && (
              <DayTable
                rowDto={rowDto}
                totalCalculation={totalCalculation}
                total={total}
              />
            )}
            {sortBy === 2 && (
              <ProductTable
                rowDto={rowDto}
                totalCalculation={totalCalculation}
                total={total}
              />
            )}
            {sortBy === 3 && (
              <TypePurchaseTable
                rowDto={rowDto}
                totalCalculation={totalCalculation}
                total={total}
              />
            )}
            {sortBy === 4 && (
              <BySupplierTable
                rowDto={rowDto}
                totalCalculation={totalCalculation}
                total={total}
              />
            )}
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default withRouter(GridData);

const DayTable = ({ rowDto, totalCalculation, total }) => {
  return (
    <table className="table table-striped table-bordered mt-3">
      <thead>
        <tr>
          <th style={{ width: "20px" }}>SL</th>

          <th style={{ width: "100px" }}>M-6.1 Entery Date</th>

          <th style={{ width: "100px" }}>Quantity</th>
          <th style={{ width: "100px" }}>Without SD/VAT</th>
          <th style={{ width: "100px" }}>VAT Amount</th>
          <th style={{ width: "100px" }}>AIT Amount</th>
          <th style={{ width: "100px" }}>AT Amount</th>
          <th style={{ width: "100px" }}>TOTAL</th>
          <th style={{ width: "100px" }}>Name of port</th>
        </tr>
      </thead>
      <tbody>
        {rowDto?.map((tableData, index) => {
          totalCalculation(tableData);
          return (
            <tr key={index}>
              <td> {index + 1} </td>
              <td className="text-center">
                {tableData?.entryDate && _dateFormatter(tableData?.entryDate)}
              </td>
              <td className="text-center"> { _fixedPointVat(tableData?.quantity, 3)}</td>
              <td className="text-right"> {_fixedPointVat(tableData?.amount)}</td>
              <td className="text-right"> {_fixedPointVat(tableData?.vatTotal)}</td>
              <td className="text-right">{_fixedPointVat(tableData?.aitTotal)}</td>
              <td className="text-right">{_fixedPointVat(tableData?.atvTotal)}</td>
              <td className="text-right">{_fixedPointVat(tableData?.grandTotal)}</td>
              <td></td>
            </tr>
          );
        })}
        <tr style={{ fontWeight: "bold" }}>
          <td colSpan="2">Total</td>
          <td className="text-center">{_fixedPointVat(total?.totalQuantity,3)}</td>
          <td className="text-right">
            {(total?.totalWithOutSdVat).toFixed(2)}
          </td>
          <td className="text-right">{(total?.totalVatAmount).toFixed(2)}</td>
          <td className="text-right">{(total?.totalAitAmount).toFixed(2)}</td>
          <td className="text-right">{(total?.totalAtAmount).toFixed(2)}</td>
          <td className="text-right">{(total?.grandTotal).toFixed(2)}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  );
};

const ProductTable = ({ rowDto, totalCalculation, total }) => {
  return (
    <table className="table table-striped table-bordered mt-3">
      <thead>
        <tr>
          <th style={{ width: "20px" }}>SL</th>
          <th style={{ width: "100px" }}>HS.code</th>
          <th style={{ width: "100px" }}>Meterial Name</th>
          <th style={{ width: "100px" }}>Supplier Name</th>
          <th style={{ width: "100px" }}>M-6.1 Entery Date</th>
          <th style={{ width: "100px" }}>Challan/Boe No</th>
          <th style={{ width: "100px" }}>Challan/Boe Date</th>
          <th style={{ width: "100px" }}>Quantity</th>
          <th style={{ width: "100px" }}>Without SD/VAT</th>
          <th style={{ width: "100px" }}>VAT Amount</th>
          <th style={{ width: "100px" }}>AIT Amount</th>
          <th style={{ width: "100px" }}>AT Amount</th>
          <th style={{ width: "100px" }}>TOTAL</th>
          <th style={{ width: "100px" }}>Name of port</th>
        </tr>
      </thead>
      <tbody>
        {rowDto?.map((tableData, index) => {
          totalCalculation(tableData);
          return (
            <tr key={index}>
              <td> {index + 1} </td>
              <td> {tableData?.hsCode}</td>
              <td> {tableData?.taxItemGroupnName}</td>
              <td> {tableData?.supplierName}</td>
              <td className="text-center">
                {tableData?.entryDate && _dateFormatter(tableData?.entryDate)}
              </td>
              <td> {tableData?.challanNo}</td>
              <td className="text-center">{_dateFormatter(tableData?.date)}</td>
              <td className="text-center"> {_fixedPointVat(tableData?.quantity,3)}</td>
              <td className="text-right"> {_fixedPointVat(tableData?.amount)}</td>
              <td className="text-right"> {_fixedPointVat(tableData?.vatTotal)}</td>
              <td className="text-right">{_fixedPointVat(tableData?.aitTotal)}</td>
              <td className="text-right">{_fixedPointVat(tableData?.atvTotal)}</td>
              <td className="text-right">{_fixedPointVat(tableData?.grandTotal)}</td>
              <td></td>
            </tr>
          );
        })}
        <tr style={{ fontWeight: "bold" }}>
          <td colSpan="7">Total</td>
          <td className="text-center">{_fixedPointVat(total?.totalQuantity,3)}</td>
          <td className="text-right">
            {(total?.totalWithOutSdVat).toFixed(2)}
          </td>
          <td className="text-right">{(total?.totalVatAmount).toFixed(2)}</td>
          <td className="text-right">{(total?.totalAitAmount).toFixed(2)}</td>
          <td className="text-right">{(total?.totalAtAmount).toFixed(2)}</td>
          <td className="text-right">{(total?.grandTotal).toFixed(2)}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  );
};

const TypePurchaseTable = ({ rowDto, totalCalculation, total }) => {
  return (
    <table className="table table-striped table-bordered mt-3">
      <thead>
        <tr>
          <th style={{ width: "20px" }}>SL</th>
          <th style={{ width: "100px" }}>Trade Type</th>
          <th style={{ width: "100px" }}>Quantity</th>
          <th style={{ width: "100px" }}>Without SD/VAT</th>
          <th style={{ width: "100px" }}>VAT Amount</th>
          <th style={{ width: "100px" }}>AIT Amount</th>
          <th style={{ width: "100px" }}>AT Amount</th>
          <th style={{ width: "100px" }}>TOTAL</th>
          <th style={{ width: "100px" }}>Name of port</th>
        </tr>
      </thead>
      <tbody>
        {rowDto?.map((tableData, index) => {
          totalCalculation(tableData);
          return (
            <tr key={index}>
              <td> {index + 1} </td>
              <td> {tableData?.tradeTypeName}</td>
              <td className="text-center"> {_fixedPointVat(tableData?.quantity, 3)}</td>
              <td className="text-right"> {_fixedPointVat(tableData?.amount)}</td>
              <td className="text-right"> {_fixedPointVat(tableData?.vatTotal)}</td>
              <td className="text-right">{_fixedPointVat(tableData?.aitTotal)}</td>
              <td className="text-right">{_fixedPointVat(tableData?.atvTotal)}</td>
              <td className="text-right">{_fixedPointVat(tableData?.grandTotal)}</td>
              <td></td>
            </tr>
          );
        })}
        <tr style={{ fontWeight: "bold" }}>
          <td colSpan="3">Total</td>
          <td className="text-center">{_fixedPointVat(total?.totalQuantity,3)}</td>
          <td className="text-right">
            {(total?.totalWithOutSdVat).toFixed(2)}
          </td>
          <td className="text-right">{(total?.totalVatAmount).toFixed(2)}</td>
          <td className="text-right">{(total?.totalAitAmount).toFixed(2)}</td>
          <td className="text-right">{(total?.totalAtAmount).toFixed(2)}</td>
          <td className="text-right">{(total?.grandTotal).toFixed(2)}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  );
};

const BySupplierTable = ({ rowDto, totalCalculation, total }) => {
  return (
    <table className="table table-striped table-bordered mt-3">
      <thead>
        <tr>
          <th style={{ width: "20px" }}>SL</th>
          {/* <th style={{ width: "100px" }}>HS.code</th>
          <th style={{ width: "100px" }}>Meterial Name</th> */}
          {/* <th style={{ width: "100px" }}>Supplier Name</th>
          <th style={{ width: "100px" }}>M-6.1 Entery Date</th>
          <th style={{ width: "100px" }}>Challan/Boe No</th>
          <th style={{ width: "100px" }}>Challan/Boe Date</th> */}
          <th style={{ width: "100px" }}>Supplier Name</th>
          <th style={{ width: "100px" }}>Quantity</th>
          <th style={{ width: "100px" }}>Without SD/VAT</th>
          <th style={{ width: "100px" }}>VAT Amount</th>
          <th style={{ width: "100px" }}>AIT Amount</th>
          <th style={{ width: "100px" }}>AT Amount</th>
          <th style={{ width: "100px" }}>TOTAL</th>
          <th style={{ width: "100px" }}>Name of port</th>
        </tr>
      </thead>
      <tbody>
        {rowDto?.map((tableData, index) => {
          totalCalculation(tableData);
          return (
            <tr key={index}>
              <td> {index + 1} </td>
              {/* <td> {tableData?.hsCode}</td>
              <td> {tableData?.taxItemGroupnName}</td>
              <td> {tableData?.supplierName}</td>
              <td className="text-center">
                {tableData?.entryDate && _dateFormatter(tableData?.entryDate)}
              </td>
              <td> {tableData?.challanNo}</td>
              <td className="text-center">{_dateFormatter(tableData?.date)}</td> */}
              <td> {tableData?.supplierName}</td>
              <td className="text-center">
                {" "}
                {_fixedPointVat(tableData?.quantity, 3)}
              </td>
              <td className="text-right">
                {" "}
                {_fixedPointVat(tableData?.amount)}
              </td>
              <td className="text-right">
                {" "}
                {_fixedPointVat(tableData?.vatTotal)}
              </td>
              <td className="text-right">
                {_fixedPointVat(tableData?.aitTotal)}
              </td>
              <td className="text-right">
                {_fixedPointVat(tableData?.atvTotal)}
              </td>
              <td className="text-right">
                {_fixedPointVat(tableData?.grandTotal)}
              </td>
              <td></td>
            </tr>
          );
        })}
        <tr style={{ fontWeight: "bold" }}>
          <td colSpan="2">Total</td>
          <td className="text-center">
            {_fixedPointVat(total?.totalQuantity, 3)}
          </td>
          <td className="text-right">
            {_fixedPointVat(total?.totalWithOutSdVat)}
          </td>
          <td className="text-right">
            {_fixedPointVat(total?.totalVatAmount)}
          </td>
          <td className="text-right">
            {_fixedPointVat(total?.totalAitAmount)}
          </td>
          <td className="text-right">{_fixedPointVat(total?.totalAtAmount)}</td>
          <td className="text-right">{_fixedPointVat(total?.grandTotal)}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  );
};
