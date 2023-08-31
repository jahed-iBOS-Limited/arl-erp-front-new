import React from "react";
import numberWithCommas from "../../_helper/_numberWithCommas";
import moment from "moment";
export default function TrailBalanceProjected({
  rowData,
  printRef,
  values,
  selectedBusinessUnit,
}) {
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
          <div ref={printRef}>
            <div className="row mt-4">
              <div className="col-12 text-center">
                <h3>{selectedBusinessUnit?.label}</h3>
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
        )}
      </div>
    </>
  );
}
