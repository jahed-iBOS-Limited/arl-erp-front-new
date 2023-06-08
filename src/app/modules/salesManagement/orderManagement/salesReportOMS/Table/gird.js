import React from "react";
import { _formatMoney } from "./../../../../_helper/_formatMoney";
function TableGird({ rowDto, values }) {
  let totalQty = 0;
  let totalRate = 0;
  let grandTotalAmount = 0;
  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th>SL</th>
            <th>Item Name</th>
            <th>UOM Name</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.map((item, i) => {
            totalQty += +item?.qty;
            totalRate += +item?.rate;
            grandTotalAmount += +item?.totalAmount;
            return (
              <tr key={i + 1}>
                <td>{i + 1}</td>
                <td>{item?.strTaxItemGroupName}</td>
                <td>{item?.strUOMName}</td>
                <td className="text-right">{_formatMoney(item?.qty, 0)}</td>
                <td className="text-right">{_formatMoney(item?.rate, 0)}</td>
                <td className="text-right">
                  {_formatMoney(item?.totalAmount, 0)}
                </td>
              </tr>
            );
          })}
          <tr>
            <td className="text-right" colspan="3">
              <b> Total</b>
            </td>

            <td className="text-right">
              <b>{_formatMoney(totalQty, 0)}</b>
            </td>
            <td className="text-right">
              <b>{_formatMoney(totalRate, 0)}</b>
            </td>
            <td className="text-right">
              <b>{_formatMoney(grandTotalAmount, 0)}</b>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TableGird;
