import React, { useEffect } from "react";

import { _dateFormatter } from "../../../_helper/_dateFormate";
import ICustomTable from "../../_chartinghelper/_customTable";
export default function NCView({ propsObj }) {
  const { data } = propsObj;
  const headers = [
    { name: "SL" },
    { name: "Description", style: { minWidth: "65px" } },
    { name: "NC?" },
    { name: "Due Date" },
    { name: "Status" },
  ];
  return (
    <>
      <div className="table-responsive">
        {data?.length > 0 ? (
          <ICustomTable ths={headers}>
            {data?.map((item, index) => (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td className="text-center">{item?.strDescription}</td>
                <td className="text-center">
                  {item?.isNcChecked ? "Yes" : "No"}
                </td>
                <td className="text-center">
                  {item?.dteDueDateTime
                    ? _dateFormatter(item?.dteDueDateTime)
                    : ""}
                </td>
                <td className="text-center">{item?.strStatus}</td>
              </tr>
            ))}
          </ICustomTable>
        ) : null}
      </div>
    </>
  );
}
