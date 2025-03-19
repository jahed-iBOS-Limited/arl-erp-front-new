import React, { useEffect, useState } from "react";
import { modifyDataset } from "../helper";

export default function DateWisePumpFoodingBillSMRT({ rowData, values }) {
  const [modifidRowDto, setModifidRowDto] = useState([]);

  useEffect(() => {
    if (rowData?.length > 0) {
      const result = modifyDataset(rowData);
      setModifidRowDto(result);
    } else {
      setModifidRowDto([]);
    }
  }, [rowData]);

  console.log(modifidRowDto);
  return (
    <div>
      <div className="loan-scrollable-table">
        <div className="scroll-table _table table-responsive">
          <table
            id=""
            className={
              "table table-striped table-bordered global-table table-font-size-sm"
            }
          >
            <thead>
              <tr className="cursor-pointer">
                <th> Employee </th>
                <th> Enroll </th>
                {modifidRowDto[0]?.dates?.map((item) => (
                  <th>{item?.key}</th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {modifidRowDto?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item?.strEmployeeName}</td>
                    <td className="text-center">{item?.intEmployeeId}</td>
                    {item?.dates?.map((item) => (
                      <td className="text-center">{item?.value}</td>
                    ))}
                    <td className="text-right">
                      {item?.dates?.reduce(
                        (acc, current) => acc + +current?.value || 0,
                        0
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td></td>
                <td></td>
                <td
                  className="text-right"
                  colSpan={modifidRowDto[0]?.dates?.length}
                >
                  <strong>Grand Total</strong>
                </td>
                <td className="text-right">
                  {modifidRowDto?.reduce((acc, item) => {
                    return (
                      acc +
                      (item?.dates?.reduce(
                        (innerAcc, current) => innerAcc + current?.value,
                        0
                      ) || 0)
                    );
                  }, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
