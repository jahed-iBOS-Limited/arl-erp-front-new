import React from "react";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";

export default function FertilizerInfoTable({ rowData }) {
  let totalImportQty = 0;
  return (
    <div>
      <h6 className="mb-0 mt-3">Fertilizer Info:</h6>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table table-font-size-sm">
          <thead>
            <tr>
              <th style={{ width: "30px" }}>SL</th>
              <th>Fertilizer Name</th>
              <th>LC No</th>
              <th>Date</th>
              <th>Bank Name</th>
              <th>Imported From</th>
              <th>Import Quantity (MT)</th>
            </tr>
          </thead>

          <tbody>
            {rowData?.map((item, index) => {
              totalImportQty += item?.importQty;
              return (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{item?.strItemName}</td>
                  <td>{item?.strLcnumber}</td>
                  <td className="text-center">
                    {_dateFormatter(item?.dteLcdate)}
                  </td>
                  <td>{item?.strBankName}</td>
                  <td>{item?.strCountryOriginName}</td>
                  <td className="text-right">{item?.importQty}</td>
                </tr>
              );
            })}
            <tr>
              <td className="text-right" colSpan={6}>
                <b>Total</b>
              </td>
              <td className="text-right">
                <b>{totalImportQty}</b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
