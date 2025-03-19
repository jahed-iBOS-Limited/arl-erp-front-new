import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

export default function FuelStationPurchaseInfoTbl({ rowData }) {
  return (
    <div>
      <h4 className="text-center mt-5">
        <strong>Date Wise Fuel Station Detail Purchase Info</strong>
      </h4>
      <div className="table-responsive">
      <table className="table table-striped table-bordered bj-table bj-table-landing">
        <thead>
          <tr>
            <th>SL</th>
            <th>Date</th>
            <th>LPG Gas</th>
            <th>Diesel</th>
            <th>Octen</th>
            <th>Total Fuel Cost</th>
            <th>Cash</th>
            <th>Credit</th>
          </tr>
        </thead>
        <tbody>
          {rowData?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td className="text-center">
                {_dateFormatter(item?.dteTripDate)}
              </td>
              <td className="text-right">{item?.lpgCash + item?.lpgCredit}</td>
              <td className="text-right">
                {item?.dieselCash + item?.dieselCredit}
              </td>
              <td className="text-right">
                {item?.octaneCash + item?.octaneCredit}
              </td>
              <td className="text-right">
                {item?.lpgCash +
                  item?.lpgCredit +
                  item?.dieselCash +
                  item?.dieselCredit +
                  item?.octaneCash +
                  item?.octaneCredit}
              </td>
              <td className="text-right">
                {item?.lpgCash + item?.dieselCash + item?.octaneCash}
              </td>
              <td className="text-right">
                {item?.lpgCredit + item?.dieselCredit + item?.octaneCredit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
