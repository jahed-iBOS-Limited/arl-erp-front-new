import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

export default function DriverTripInfoTbl({ rowData }) {
  const totalKM = rowData?.reduce((acc, curr) => acc + curr?.tripKM, 0);
  const totalTollAmount = rowData?.reduce((acc, curr) => acc + curr?.numTollAmount, 0);
  const totalOthers = rowData?.reduce((acc, curr) => acc + curr?.numOthersAmount, 0)
  const totalMaintenance = rowData?.reduce((acc, curr) => acc + curr?.numRepairingAmount, 0)
  const totalDriverCost = rowData?.reduce((acc, curr) => {
    const total = curr?.numTollAmount + curr?.numOthersAmount + curr?.numRepairingAmount
    return acc + total;
  }, 0);

  const totalLPG = rowData?.reduce((acc, curr) => acc + curr?.lpeg, 0);
  const totalDiesel = rowData?.reduce((acc, curr)=> acc = curr?.diesel, 0);
  const totalOctane = rowData?.reduce((acc, curr)=> acc = curr?.octane, 0);
  const totalFuelCost = totalLPG + totalDiesel + totalOctane;
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
            <tr key={index}>
              <td className="text-center">{index + 1}</td>
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
          <tr style={{fontWeight: "bold"}}>
            <td colSpan={3} >Total</td>
            <td className="text-right"> {totalKM} </td>
            <td colSpan={3}></td>
            <td className="text-right">{totalTollAmount}</td>
            <td className="text-right">{"DA"}</td>
            <td className="text-right">{totalOthers}</td>
            <td className="text-right">{totalMaintenance}</td>
            <td className="text-right">{totalDriverCost}</td>
            <td className="text-right">{totalLPG}</td>
            <td className="text-right">{totalDiesel}</td>
            <td className="text-right">{totalOctane}</td>
            <td className="text-right">{totalFuelCost}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
