import React, { useEffect, useState } from "react";
import { modifyDataset } from "../helper";

export default function DateWisePumpFoodingBillSMRT({ rowData, values }) {
  const [modifidRowDto, setModifidRowDto] = useState([]);

  useEffect(() => {
    if (rowData?.length > 0) {
      const result = modifyDataset(rowData);
      setModifidRowDto(result);
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
                {modifidRowDto[0]?.dates?.map((item) => (
                  <th>{item?.key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modifidRowDto?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item?.strEmployeeName}</td>
                    {item?.dates?.map((item) => (
                      <td className="text-center">{item?.value}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
