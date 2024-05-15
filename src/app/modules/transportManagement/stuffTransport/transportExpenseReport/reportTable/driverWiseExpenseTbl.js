import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

export default function DriverWiseExpenseTbl({ rowData }) {
  return (
    <div>
      <h4 className="text-center mt-5">
        <strong>Driver Date Wise Expense</strong>
      </h4>
      <div className="table-responsive">
      <table className="table table-striped table-bordered bj-table bj-table-landing">
        <thead>
          <tr>
            <th>SL</th>
            <th>Date</th>
            <th>Toll</th>
            <th>Food</th>
            <th>Others</th>
            <th>Maintaince</th>
            <th>Total Driver Expense</th>
          </tr>
        </thead>
        <tbody>
          {rowData?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td className="text-center">
                {_dateFormatter(item?.dteTripDate)}
              </td>
              <td className="text-right">{item?.numTollAmount}</td>
              <td className="text-right">{item?.numFoodAmount}</td>
              <td className="text-right">{item?.numOthersAmount}</td>
              <td className="text-right">{item?.numRepairingAmount}</td>
              <td className="text-right">
                {item?.numTollAmount +
                  item?.numFoodAmount +
                  item?.numOthersAmount +
                  item?.numRepairingAmount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
