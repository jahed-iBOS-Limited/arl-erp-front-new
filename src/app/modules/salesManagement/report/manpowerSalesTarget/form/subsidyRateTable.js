import React from "react";
import InputField from "../../../../_helper/_inputField";

const SubsidyRateTable = ({ obj }) => {
  const { rowData, allSelect, selectedAll, rowDataChange } = obj;
  return (
    <div>
      {rowData?.length > 0 && (
        <table
          className={
            "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
          }
        >
          <thead>
            <tr className="cursor-pointer">
              <th
                className="text-center cursor-pointer"
                style={{ width: "40px" }}
                onClick={() => allSelect(!selectedAll())}
              >
                <input
                  type="checkbox"
                  value={selectedAll()}
                  checked={selectedAll()}
                  onChange={() => {}}
                />
              </th>
              <th>SL</th>
              <th>Month</th>
              <th>Rate</th>
            </tr>
          </thead>
          {rowData?.map((row, index) => (
            <tr key={index}>
              <td
                onClick={() => {
                  rowDataChange(index, "isSelected", !row.isSelected);
                }}
                className="text-center"
              >
                <input
                  type="checkbox"
                  value={row?.isSelected}
                  checked={row?.isSelected}
                  // onChange={() => {}}
                />
              </td>
              <td className="text-center" style={{ width: "40px" }}>
                {index + 1}
              </td>
              <td>{row?.label}</td>
              <td className="text-right" style={{ width: "150px" }}>
                <InputField
                  value={row?.rate}
                  name="rate"
                  type="number"
                  onChange={(e) => {
                    rowDataChange(index, "rate", e?.target?.value);
                  }}
                />
              </td>
            </tr>
          ))}
        </table>
      )}
    </div>
  );
};

export default SubsidyRateTable;
