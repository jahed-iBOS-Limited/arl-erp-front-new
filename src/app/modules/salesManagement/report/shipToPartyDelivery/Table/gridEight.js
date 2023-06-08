import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { shallowEqual, useSelector } from "react-redux";
import { dateFormatWithMonthName } from "../../../../_helper/_dateFormate";

const ths = [
  "Sl",
  "Customer Name",
  "Delivery Quantity",
  "Total Amount",
  "Trs. Zone Amount",
  "Handling Cost",
  "Loading Labour Cost",
  "Subsidiary Amount",
];

function TableGirdEight({ rowDto, excelRef, values }) {
  const {
    selectedBusinessUnit: { label: businessUnit, address },
  } = useSelector((state) => state?.authData, shallowEqual);
  return (
    <div>
      <div className="mt-5 ml-1">
        <ReactHTMLTableToExcel
          ref={excelRef}
          id="test-table-xls-button-att-reports"
          className="d-none"
          table={"table-to-xlsx"}
          filename="Supplier Base Delivery (Customer Challan - Top Sheet)"
          sheet="Supplier Base Delivery (Customer Challan - Top Sheet)"
          buttonText="Export Excel"
        />
      </div>
      <div className="react-bootstrap-table table-responsive">
        <table
          className={"table table-striped table-bordered global-table "}
          id="table-to-xlsx"
        >
          <div style={{ textAlign: "center" }} className="d-none">
            <h3>
              <b> {businessUnit} </b>
            </h3>
            <h5>
              <b> {address} </b>
            </h5>
            <h3>
              <b>{values?.reportType?.label}</b>
            </h3>
            <div>
              <h5>
                From Date:
                {dateFormatWithMonthName(values?.fromDate)}____
                <span style={{ marginLeft: "20px" }}>
                  To Date: {dateFormatWithMonthName(values?.toDate)}
                </span>
              </h5>
            </div>
            <div style={{ color: "white" }}>_</div>
          </div>
          <thead>
            <tr>
              {ths.map((th, index) => {
                return <th key={index}> {th} </th>;
              })}
            </tr>
          </thead>
          <tbody>
            {rowDto.map((element, index) => {
              return (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{element?.customerName}</td>
                  <td className="text-right">
                    {_fixedPoint(element?.deliveryQty, true, 0)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(element?.deliveryValue, true, 2)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(element?.transportzoneAmount, true, 2)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(element?.handlingCost, true, 2)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(element?.loadingLabourCostAmaount, true, 2)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(element?.subsidiaryAmaount, true, 2)}
                  </td>
                </tr>
              );
            })}
            <tr style={{ fontWeight: "bold" }}>
              <td colSpan={2} className="text-right">
                <b>Grand Total </b>
              </td>
              <td className="text-right">
                {_fixedPoint(
                  rowDto?.reduce((acc, cur) => (acc += cur?.deliveryQty), 0),
                  true,
                  2
                )}
              </td>
              <td className="text-right">
                {_fixedPoint(
                  rowDto?.reduce((acc, cur) => (acc += cur?.deliveryValue), 0),
                  true,
                  2
                )}
              </td>
              <td className="text-right">
                {_fixedPoint(
                  rowDto?.reduce(
                    (acc, cur) => (acc += cur?.transportzoneAmount),
                    0
                  ),
                  true,
                  2
                )}
              </td>
              <td className="text-right">
                {_fixedPoint(
                  rowDto?.reduce((acc, cur) => (acc += cur?.handlingCost), 0),
                  true,
                  2
                )}
              </td>
              <td className="text-right">
                {_fixedPoint(
                  rowDto?.reduce(
                    (acc, cur) => (acc += cur?.loadingLabourCostAmaount),
                    0
                  ),
                  true,
                  2
                )}
              </td>
              <td className="text-right">
                {_fixedPoint(
                  rowDto?.reduce(
                    (acc, cur) => (acc += cur?.subsidiaryAmaount),
                    0
                  ),
                  true,
                  2
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableGirdEight;
