import React from "react";
import { _formatMoney } from "../../../_helper/_formatMoney";

export default function ViewTable({ rowDto }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
        <thead>
          <tr>
            <th>SL</th>
            <th>Item Code</th>
            <th>Item Name</th>
            <th>UoM</th>
            <th>Sales Plant Qty</th>
            <th>Distribution Plant Qty</th>
            <th>Plan Qty(Direct)</th>
            <th>Plan Rate(Direct)</th>
            <th>Plan Qty(Via Transshipment)</th>
            <th>Plan Rate(Via Transshipment)</th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.itemList?.length > 0 &&
            rowDto?.itemList?.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item?.itemCode}</td>
                <td>{item?.itemName}</td>
                <td>{item?.itemUoMName}</td>
                <td className="text-center">{item?.salesPlanQty}</td>
                <td className="text-center">{item?.distributionPlanQty}</td>
                <td className="text-center">{item?.planQty}</td>
                <td className="text-right">{_formatMoney(item?.planRate)}</td>
                <td className="text-center">{item?.planTransQty}</td>
                <td className="text-right">
                  {_formatMoney(item?.planTransRate)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
