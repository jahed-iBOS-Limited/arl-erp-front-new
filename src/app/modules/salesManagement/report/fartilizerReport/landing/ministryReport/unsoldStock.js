import React from "react";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";

export default function UnsoldInfoTable({ rowData }) {
  let totalSoldQty = 0;
  let totalUnsoldQty = 0;
  return (
    <div>
      <h6 className="mb-0 mt-3">Unsold Stock Info</h6>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table table-font-size-sm">
          <thead>
            <tr>
              <th style={{ width: "30px" }}>SL</th>
              <th>Fertilizer Name</th>
              <th>LC No</th>
              <th>Date</th>
              <th>Bank Name</th>
              <th>Sold Quantity (MT)</th>
              <th>Unsold Quantity (MT)</th>
            </tr>
          </thead>

          <tbody>
            {rowData?.map((item, index) => {
              totalSoldQty += item?.soldQty;
              totalUnsoldQty += item?.unSoldQty;
              return (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{item?.strItemName}</td>
                  <td>{item?.strLcnumber}</td>
                  <td className="text-center">
                    {_dateFormatter(item?.dteLcdate)}
                  </td>
                  <td>{item?.strBankName}</td>
                  <td className="text-right">{item?.soldQty}</td>
                  <td className="text-right">{item?.unSoldQty}</td>
                </tr>
              );
            })}
            <tr>
              <td className="text-right" colSpan={5}>
                <b>Total</b>
              </td>
              <td className="text-right">
                <b>{totalSoldQty}</b>
              </td>
              <td className="text-right">
                <b>{totalUnsoldQty}</b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
