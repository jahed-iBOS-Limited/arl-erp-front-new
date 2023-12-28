import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

export default function DriverTripInfoTbl({ rowData }) {
  return (
    <div>
      <h4 className="text-center mt-5">
        <strong>Driver Trip info</strong>
      </h4>
      <table className="table table-striped table-bordered bj-table bj-table-landing">
        <thead>
          <tr>
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
            <tr key={index}>
              <td className="text-center">
                {_dateFormatter(item?.dteTripDate)}
              </td>
              <td></td>
              <td className="text-center">{item?.tripKM}</td>
              <td className="text-center">{item?.strVehicleNo}</td>
              <td>{item?.strFirstRoundStartAddress}</td>
              <td>{item?.strFirstRoundEndAddress}</td>
              <td className="text-right">{item?.numTollAmount}</td>
              <td></td>
              <td className="text-right">{item?.numOthersAmount}</td>
              <td className="text-right">{item?.numRepairingAmount}</td>
              <td className="text-right">
                {item?.numTollAmount +
                  item?.numOthersAmount +
                  item?.numRepairingAmount}
              </td>
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
  );
}
