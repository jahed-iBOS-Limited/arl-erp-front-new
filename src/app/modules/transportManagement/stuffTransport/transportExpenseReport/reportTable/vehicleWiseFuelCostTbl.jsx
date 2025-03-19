import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

export default function VehicleWiseFuelCostTbl({ rowData }) {
  return (
    <div>
      <h4 className="text-center mt-5">
        <strong>Vehicle Wise Detail Fuel Cost</strong>
      </h4>
      <div className="table-responsive">
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
              <td>{index + 1}</td>
              <td className="text-center">
                {_dateFormatter(item?.dteTripDate)}
              </td>
              <td className="text-center">{item?.tripKM}</td>
              <td className="text-right">{item?.lpeg}</td>
              <td className="text-right">{item?.diesel}</td>
              <td className="text-right">{item?.octane}</td>
              <td className="text-right">
                {item?.lpeg + item?.diesel + item?.octane}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
