import React from "react";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";

const ViewBaddebt = ({ tableData }) => {
  return (
    <div className="row">
      <div className="col-12">
      <div className="table-responsive">
      <table className="table table-striped table-bordered global-table mt-0 table-font-size-sm mt-5">
          <thead className="bg-secondary">
            <tr>
              <th>SL</th>
              <th>Revenue</th>
              <th>From</th>
              <th>To</th>
              <th>Revenue Amount</th>
              <th>Baddebt Amount</th>
            </tr>
          </thead>
          <tbody>
            {tableData?.map((item, index) => (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td className="text-center">{item?.Revenue}</td>
                <td className="text-center">
                  {_dateFormatter(item?.dteFromDate)}
                </td>
                <td className="text-center">
                  {_dateFormatter(item?.dteToDate)}
                </td>
                <td className="text-right">{item?.numRevenueAmount}</td>
                <td className="text-right">{item?.numBadDebtAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};

export default ViewBaddebt;
