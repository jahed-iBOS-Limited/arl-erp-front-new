import React from "react";

export default function BudgetVarianceReportTable({ tableData }) {
  return (
    <div className="mt-2">
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table mt-0">
          <thead>
            <tr>
              <th>SL</th>
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Uom Name</th>
              <th>Actual Qty</th>
              <th>Budget Qty</th>
              <th>Variance</th>
            </tr>
          </thead>
          <tbody>
            {tableData?.length > 0 &&
              tableData?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className="text-center">{item?.itemCode}</td>
                  <td>{item?.itemName}</td>
                  <td>{item?.uomName}</td>
                  <td className="text-right">{item?.actualQty}</td>
                  <td className="text-right">{item?.budgetQty}</td>
                  <td className="text-right">{item?.variance}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
