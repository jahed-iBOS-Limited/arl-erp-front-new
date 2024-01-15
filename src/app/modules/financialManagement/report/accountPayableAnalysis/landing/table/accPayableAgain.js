import React from "react";
import { _dateFormatterTwo } from "../../../../../_helper/_dateFormate";

export default function AccountPayableAginTable({ rowDto, values, printRef }) {
  return (
    <div>
      {rowDto?.length > 0 && (
        <div className="common-scrollable-table two-column-sticky">
          <div className="scroll-table _table">
            <table
              ref={printRef}
              id="table-to-xlsx2"
              className="table table-striped table-bordered mt-3 bj-table bj-table-landing mr-1"
            >
              <thead>
                <tr>
                  <th>SL</th>
                  <th style={{ minWidth: "150px" }}>Supplier Name</th>
                  <th style={{ minWidth: "120px" }}>PO Number</th>
                  <th style={{ minWidth: "120px" }}>PO Date</th>
                  <th style={{ minWidth: "120px" }}>Invoice Number</th>
                  <th style={{ minWidth: "120px" }}>Invoice Date</th>
                  <th style={{ minWidth: "120px" }}>Invoice Amount</th>
                  <th style={{ minWidth: "120px" }}>Advance Amount</th>
                  <th style={{ minWidth: "120px" }}>Due Date</th>
                  <th style={{ minWidth: "120px" }}>Total Payable</th>
                  <th style={{ minWidth: "120px" }}>0-30 Days</th>
                  <th style={{ minWidth: "120px" }}>31-60 Days</th>
                  <th style={{ minWidth: "120px" }}>61-90 Days</th>
                  <th style={{ minWidth: "120px" }}>91 Days Above</th>
                </tr>
              </thead>
              <tbody>
                {rowDto?.map((item, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td className="text-center">{item["Suppliere Name"]}</td>
                    <td className="text-center">{item["PO Number"]}</td>
                    <td className="text-center">{_dateFormatterTwo(item["PO Date"])}</td>
                    <td>{item["Invoice Number"]}</td>
                    <td className="text-center">{_dateFormatterTwo(item["Invoice Date"])}</td>
                    <td>{item["Invoice Amount"]}</td>
                    <td>{item["Advance Amount"]}</td>
                    <td className="text-center">{_dateFormatterTwo(item["Due Date"])}</td>
                    <td>{item["Total Payable"]}</td>
                    <td>{item["0 - 30 Days"]}</td>
                    <td>{item["31 - 60 Days"]}</td>
                    <td>{item["61 - 90 Days"]}</td>
                    <td>{item["91 - Avobe"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
