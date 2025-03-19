import React from "react";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";

export default function ReferenceViewModal({ refData }) {
  return (
    <div className="mt-2">
      {refData?.length > 0 && (
        <>
          <table className="table table-striped table-bordered inv-table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Reference Code</th>
                <th>Reference Date</th>
              </tr>
            </thead>
            <tbody>
              {refData?.map((item, index) => (
                <tr key={index}>
                  <td className="text-center align-middle"> {index + 1} </td>
                  <td className="text-center align-middle">
                    {item?.inventoryTransactionCode}
                  </td>
                  <td className="text-center align-middle">
                    {_dateFormatter(item?.transactionDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
