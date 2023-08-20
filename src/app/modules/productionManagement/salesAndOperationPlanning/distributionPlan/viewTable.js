import React from 'react';

export default function ViewTable({ rowDto }) {
  return (
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
              <td>{item?.salesPlanQty}</td>
              <td>{item?.distributionPlanQty}</td>
              <td>{item?.planQty}</td>
              <td>{item?.planRate}</td>
              <td>{item?.planTransQty}</td>
              <td>{item?.planTransRate}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
