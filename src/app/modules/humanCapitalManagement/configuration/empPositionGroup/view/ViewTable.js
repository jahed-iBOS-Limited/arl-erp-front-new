/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

import ICustomTable from "../../../../_helper/_customTable";

const headers = ["SL", "Employee Position", "Position Code"];

const TBody = ({ singleData }) => {
  return (
    <>
      {singleData &&
        singleData.length > 0 &&
        singleData.map((item, index) => {
          return (
            <tr key={index}>
              <td style={{ textAlign: "center" }}>{index + 1}</td>
              <td style={{ textAlign: "center" }}>{item.positionGroupName}</td>
              <td style={{ textAlign: "center" }}>{item.positionGroupCode}</td>
            </tr>
          );
        })}
    </>
  );
};

export function ViewTable({ singleData }) {
  return (
    <>
      <ICustomTable
        ths={headers}
        children={<TBody singleData={singleData} />}
      />
    </>
  );
}
