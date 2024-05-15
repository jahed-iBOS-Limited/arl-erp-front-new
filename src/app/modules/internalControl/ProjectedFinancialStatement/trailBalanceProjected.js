import React, { useRef } from "react";
import numberWithCommas from "../../_helper/_numberWithCommas";
import moment from "moment";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReactToPrint from "react-to-print";
import { dateFormatWithMonthName } from "../../_helper/_dateFormate";

export default function TrailBalanceProjected({
  rowData,
  values,
  selectedBusinessUnit,
}) {
  const printRef = useRef();

  const debitTotal = rowData.reduce((total, data) => {
    return total + data?.debit;
  }, 0);
  const creditTotal = rowData.reduce((total, data) => {
    return total + data?.credit;
  }, 0);
  return (
    <>
      <div>
        {rowData.length > 0 && (
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
                  <h4 className="text-primary">Projected Trail Balance</h4>
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
                      <th>Account Code</th>
                      <th>Account Name</th>
                      <th>Debit</th>
                      <th>Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowData?.map((data, index) => (
                      <tr key={index}>
                        <td>
                          <div className="text-right pr-2">
                            {data?.generalLedgerCode}
                          </div>
                        </td>
                        <td>
                          <div className="pl-2">{data?.generalLedgerName}</div>
                        </td>
                        <td>
                          <div className="text-right pr-2">
                            {data?.debit !== 0
                              ? numberWithCommas(Math.round(data?.debit) || 0)
                              : " "}
                          </div>
                        </td>
                        <td>
                          <div className="text-right pr-2">
                            {data?.credit !== 0
                              ? numberWithCommas(Math.round(data?.credit) || 0)
                              : " "}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {rowData.length > 0 && (
                      <>
                        <tr>
                          <td></td>
                          <td style={{ textAlign: "right" }}>Total</td>
                          <td>
                            <div className="text-right pr-2">
                              {numberWithCommas(Math.round(debitTotal) || 0)}
                            </div>
                          </td>
                          <td>
                            <div className="text-right pr-2">
                              {numberWithCommas(Math.round(creditTotal || 0))}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td
                            className="text-center d-none"
                            colSpan={4}
                          >{`System Generated Report - ${moment().format(
                            "LLLL"
                          )}`}</td>
                        </tr>
                      </>
                    )}
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
