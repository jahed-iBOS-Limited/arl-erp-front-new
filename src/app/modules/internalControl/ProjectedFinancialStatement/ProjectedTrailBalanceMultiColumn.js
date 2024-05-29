import React, { useRef } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReactToPrint from "react-to-print";
import { dateFormatWithMonthName } from "../../_helper/_dateFormate";
import numberWithCommas from "../../_helper/_numberWithCommas";

export default function ProjectedTrailBalanceMultiColumn({
  rowData,
  values,
  selectedBusinessUnit,
}) {
  const printRef = useRef();
  console.log("values", values);
  return (
    <>
      <div>
        {rowData?.length > 0 && (
          <>
            <div>
              <div
                className="d-flex justify-content-end"
                style={{ marginTop: "25px" }}
              >
                <ReactHTMLTableToExcel
                  id="test-table-xls-button"
                  className="download-table-xls-button btn btn-primary"
                  table="table-to-xlsx"
                  filename="tablexls"
                  sheet="tablexls"
                  buttonText="Export Excel"
                />
                <ReactToPrint
                  pageStyle={
                    "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                  }
                  trigger={() => (
                    <button
                      type="button"
                      className="btn btn-sm btn-primary sales_invoice_btn ml-3"
                    >
                      Print
                    </button>
                  )}
                  content={() => printRef.current}
                />
              </div>
            </div>
            <div ref={printRef}>
              <div className="row mt-4">
                <div className="col-12 text-center">
                  <h2>{selectedBusinessUnit}</h2>
                  <h4 className="text-primary">
                    Projected Trail Balance Multi-Column
                  </h4>
                  <p>
                    <strong>
                      For the period from :{" "}
                      <span>{dateFormatWithMonthName(values?.fromDate)}</span>{" "}
                      To <span>{dateFormatWithMonthName(values?.toDate)}</span>
                    </strong>
                  </p>
                </div>
              </div>
              <div className="table-responsive">
                <table
                  id="table-to-xlsx"
                  className="table table-striped table-bordered global-table table-font-size-sm"
                  style={{ width: "100%" }}
                >
                  <thead>
                    <tr>
                      <th>Gl Code</th>
                      <th>Gl Name</th>
                      <th>January</th>
                      <th>February</th>
                      <th>March</th>
                      <th>April</th>
                      <th>May</th>
                      <th>June</th>
                      <th>July</th>
                      <th>August</th>
                      <th>September</th>
                      <th>October</th>
                      <th>November</th>
                      <th>December</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowData?.map((data, index) => (
                      <tr key={index}>
                        <td>
                          <div className="text-right pr-2">
                            {data?.strGeneralLedgerCode}
                          </div>
                        </td>
                        <td>
                          <div className="text-right pr-2">
                            {data?.strGeneralLedgerName}
                          </div>
                        </td>
                        <td>
                          <div className="text-right pr-2">
                            {numberWithCommas(Math.round(data?.junAmount) || 0)}
                          </div>
                        </td>
                        <td>
                          <div className="text-right pr-2">
                            {numberWithCommas(Math.round(data?.febAmount) || 0)}
                          </div>
                        </td>
                        <td>
                          <div className="text-right pr-2">
                            {numberWithCommas(Math.round(data?.marAmount) || 0)}
                          </div>
                        </td>
                        <td>
                          <div className="text-right pr-2">
                            {numberWithCommas(Math.round(data?.aprAmount) || 0)}
                          </div>
                        </td>
                        <td>
                          <div className="text-right pr-2">
                            {numberWithCommas(Math.round(data?.mayAmount) || 0)}
                          </div>
                        </td>
                        <td>
                          <div className="text-right pr-2">
                            {numberWithCommas(Math.round(data?.junAmount) || 0)}
                          </div>
                        </td>
                        <td>
                          <div className="text-right pr-2">
                            {numberWithCommas(Math.round(data?.julAmount) || 0)}
                          </div>
                        </td>
                        <td>
                          <div className="text-right pr-2">
                            {numberWithCommas(Math.round(data?.augAmount) || 0)}
                          </div>
                        </td>
                        <td>
                          <div className="text-right pr-2">
                            {numberWithCommas(Math.round(data?.sepAmount) || 0)}
                          </div>
                        </td>
                        <td>
                          <div className="text-right pr-2">
                            {numberWithCommas(Math.round(data?.octAmount) || 0)}
                          </div>
                        </td>
                        <td>
                          <div className="text-right pr-2">
                            {numberWithCommas(Math.round(data?.novAmount) || 0)}
                          </div>
                        </td>
                        <td>
                          <div className="text-right pr-2">
                            {numberWithCommas(Math.round(data?.decAmount) || 0)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
