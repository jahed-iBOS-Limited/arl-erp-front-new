/* eslint-disable no-unused-vars */
import React, { useState } from "react";

const AdditionDeductionReport = () => {
  const [rowDto, setRowDto] = useState([]);
  return (
    <div>
      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
        <thead>
          <tr>
            <th>SL</th>
            <th>Employee Name</th>
            <th>Addition/Deduction Type</th>
            <th>Type</th>
            <th>Month</th>
            <th>Year</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.length > 0 &&
            rowDto?.map((item, index) => {
              return (
                <tr key={index}>
                  <td style={{ width: "30px" }} className="text-center">
                    {index + 1}
                  </td>
                  <td>
                    <div>{item?.employeeName}</div>
                  </td>
                  <td>
                    <div>{item?.deductionType?.strType}</div>
                  </td>
                  <td>
                    <div>
                      {item?.deductionType?.isAddition
                        ? "Addition"
                        : "Deduction"}
                    </div>
                  </td>
                  <td className="text-center">
                    <div>{item?.month}</div>
                  </td>
                  <td>
                    <div className="text-center">{item?.year}</div>
                  </td>

                  <td>
                    <div className="text-right">{item?.numAmount}</div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default AdditionDeductionReport;
