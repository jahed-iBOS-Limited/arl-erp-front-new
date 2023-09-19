import React, { useRef } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReactToPrint from "react-to-print";

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
                  <h3>{selectedBusinessUnit}</h3>
                  <p>
                    From <span>{values?.fromDate}</span> To{" "}
                    <span>{values?.toDate}</span>
                  </p>
                </div>
              </div>
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
                        <div className="text-right pr-2">{data?.junAmount}</div>
                      </td>
                      <td>
                        <div className="text-right pr-2">{data?.febAmount}</div>
                      </td>
                      <td>
                        <div className="text-right pr-2">{data?.marAmount}</div>
                      </td>
                      <td>
                        <div className="text-right pr-2">{data?.aprAmount}</div>
                      </td>
                      <td>
                        <div className="text-right pr-2">{data?.mayAmount}</div>
                      </td>
                      <td>
                        <div className="text-right pr-2">{data?.junAmount}</div>
                      </td>
                      <td>
                        <div className="text-right pr-2">{data?.julAmount}</div>
                      </td>
                      <td>
                        <div className="text-right pr-2">{data?.augAmount}</div>
                      </td>
                      <td>
                        <div className="text-right pr-2">{data?.sepAmount}</div>
                      </td>
                      <td>
                        <div className="text-right pr-2">{data?.octAmount}</div>
                      </td>
                      <td>
                        <div className="text-right pr-2">{data?.novAmount}</div>
                      </td>
                      <td>
                        <div className="text-right pr-2">{data?.decAmount}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
