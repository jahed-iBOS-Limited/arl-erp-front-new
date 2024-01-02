import React from "react";

export default function VehicleWiseFuelCostTbl({ rowData }) {
  return (
    <div>
      <h4 className="text-center mt-5">
        <strong>Vehicle Wise Detail Fuel Cost</strong>
      </h4>
      <table className="table table-striped table-bordered bj-table bj-table-landing">
        <thead>
          <tr>
            <th>SL</th>
            <th>Date</th>
            <th>KM</th>
            <th>LPG Gas</th>
            <th>Diesel</th>
            <th>Octen</th>
            <th>Total Fuel Cost</th>
          </tr>
        </thead>
        <tbody>
          {rowData?.map((item, index) => (
            <tr>
              <td>SL</td>
              <td>Date</td>
              <td>KM</td>
              <td>LPG Gas</td>
              <td>Diesel</td>
              <td>Octen</td>
              <td>Total Fuel Cost</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
