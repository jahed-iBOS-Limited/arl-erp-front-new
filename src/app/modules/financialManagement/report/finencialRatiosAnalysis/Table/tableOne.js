import React from "react";
import ICustomTable from "../../../../_helper/_customTable";

const TableOne = ({ rowDto }) => {
  const headers = ["SL", "Rario Name", "Std Ratio", "Act Ratio", "Matric"];
  return (
    <div>
      <h6 className="m-0 p-0 mt-2">Financial Ratio</h6>
      <ICustomTable ths={headers} className="table-font-size-sm">
        {rowDto?.map((item, index) => {
          return (
            <tr
              key={index}
              style={{
                fontWeight: Number.isInteger(item?.numSL || 0) ? "bold" : "",
              }}
            >
              <>
                <td className="text-right">{item?.numSL}</td>
                <td className="text-left">{item?.strRarioName}</td>

                <td className="text-right">{item?.stdRatio ? item?.stdRatio : ""}</td>
                <td className="text-right">{item?.numRatio ? item?.numRatio : ""}</td>
                <td>{item?.strMatric}</td>
              </>
            </tr>
          );
        })}
      </ICustomTable>
    </div>
  );
};

export default TableOne;
