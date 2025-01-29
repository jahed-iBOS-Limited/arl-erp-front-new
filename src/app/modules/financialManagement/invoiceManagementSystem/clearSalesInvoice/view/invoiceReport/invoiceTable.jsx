import React from "react";

export default function InvoiceTableBlueHeader({ ths, children }) {
  return (
    <div className="react-bootstrap-table table-responsive" id="blue-table">
      <table className="table table-striped table-bordered global-table">
        <thead>
          
            <tr>
              {ths.map((th, index) => {
                return (
                  <th
                    key={index}
                    className="blue-table"
                    style={{ color: "white" }}
                  >
                    {th}
                  </th>
                );
              })}
            </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
