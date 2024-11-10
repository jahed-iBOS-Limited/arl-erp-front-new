import React from "react";
import { _formatMoney } from "../../_helper/_formatMoney";

export default function MaterialPriceVarianceTable({ rowDto }) {
  return (
    <div className="row mt-5">
      <div className="col-lg-12">
        <div className="table-responsive">
          <table className="table table-striped table-bordered bj-table bj-table-landing">
            <thead>
              <tr>
                <th style={{ width: "30px" }}>SL</th>
                <th>Materials</th>
                <th>UOM</th>
                <th> Budget Price(Rate)</th>
                <th> Actual Price(Rate)</th>
                <th>Variance</th>
              </tr>
            </thead>
            <tbody>
              {rowDto?.length > 0 &&
                rowDto?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item?.ItemName}</td>
                    <td>{item?.UoM}</td>
                    <td className="text-right">
                      {_formatMoney(item?.BudgetPrice)}
                    </td>
                    <td className="text-right">
                      {_formatMoney(item?.ActualPrice)}
                    </td>
                    <td className="text-right">
                      {_formatMoney(item?.Variance)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
