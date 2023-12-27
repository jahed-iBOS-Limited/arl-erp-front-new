import React from "react";

export default function DriverTripInfoTbl({ rowData }) {
  return (
    <div>
      <h4 className="text-center mt-5">
        <strong>Driver Trip info</strong>
      </h4>
      <table className="table table-striped table-bordered bj-table bj-table-landing">
        <thead>
          <tr>
            <th>SL</th>
            <th>Date</th>
            <th>Trip No</th>
            <th>KM</th>
            <th>Vehicle No</th>
            <th>From</th>
            <th>To</th>
            <th>Toll</th>
            <th>DA</th>
            <th>Others</th>
            <th>Maintaince</th>
            <th>Total Driver Cost</th>
            <th>LPG Gas</th>
            <th>Diesel</th>
            <th>Octane </th>
            <th>Total Fuel Cost</th>
          </tr>
        </thead>
        <tbody>
          {rowData?.map((item, index) => (
            <tr>
              <td>SL</td>
              <td>Date</td>
              <td>Trip No</td>
              <td>KM</td>
              <td>Vehicle No</td>
              <td>From</td>
              <td>To</td>
              <td>Toll</td>
              <td>DA</td>
              <td>Others</td>
              <td>Maintaince</td>
              <td>Total Driver Cost</td>
              <td>LPG Gas</td>
              <td>Diesel</td>
              <td>Octane </td>
              <td>Total Fuel Cost</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
