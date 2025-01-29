import React from "react";
import InputField from "../../../../_helper/_inputField";

export default function ManpowerSalesTargetFormTable({ obj }) {
  const { rowData, values, allSelect, selectedAll, rowDataChange, buId } = obj;
  return (
    <>
      {rowData?.length > 0 && [1, 2, 3, 4].includes(values?.type?.value) && (
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
              {[1, 2, 3].includes(values?.type?.value) ? (
                <>
                  <th>{buId === 144 ? "TSO Name" : "Employee Name"}</th>
                  {[1].includes(values?.type?.value) && [144].includes(buId) ? (
                    <>
                      <th>Territory Name</th>
                      <th>Territory Type Name</th>{" "}
                    </>
                  ) : null}
                  <th>{buId === 144 ? "TSO ID" : "Employee ID"}</th>
                  {/* <th>Employee ID</th> */}
                </>
              ) : (
                <th>ShipPoint</th>
              )}
              <th>Region</th>
              <th>Area</th>
              <th>Territory</th>
              {[3]?.includes(values?.type?.value) ||
                ([1]?.includes(values?.type?.value) && buId !== 144 && (
                  <th>Zone Name</th>
                ))}
              {buId === 144 ? (
                <>
                  <th>Chinigura Target</th>
                  <th>Non-Chinigura Target</th>
                </>
              ) : (
                <th>Target Qty</th>
              )}
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
              {[1, 2, 3].includes(values?.type?.value) ? (
                <>
                  <td>{row?.employeeName}</td>
                  {[1].includes(values?.type?.value) && [144].includes(buId) ? (
                    <>
                      <td>{row?.territoryName}</td>
                      <td>{row?.territoryTypeName}</td>{" "}
                    </>
                  ) : null}
                  <td>{row?.employeeId}</td>
                </>
              ) : (
                <td>{row?.label}</td>
              )}
              <td>{row?.regionName}</td>
              <td>{row?.areaName}</td>
              <td>{row?.territoryName}</td>
              {[3]?.includes(values?.type?.value) ||
                ([1]?.includes(values?.type?.value) && buId !== 144 && (
                  <td>{row?.zoneName}</td>
                ))}
              {buId === 144 ? (
                <>
                  <td className="text-right" style={{ width: "150px" }}>
                    <InputField
                      value={row?.chiniguraQty}
                      name="chiniguraQty"
                      type="number"
                      onChange={(e) => {
                        rowDataChange(index, "chiniguraQty", e?.target?.value);
                      }}
                    />
                  </td>
                  <td className="text-right" style={{ width: "150px" }}>
                    <InputField
                      value={row?.nonChiniguraQty}
                      name="nonChiniguraQty"
                      type="number"
                      onChange={(e) => {
                        rowDataChange(
                          index,
                          "nonChiniguraQty",
                          e?.target?.value
                        );
                      }}
                    />
                  </td>
                </>
              ) : (
                <td className="text-right" style={{ width: "150px" }}>
                  <InputField
                    value={row?.targetQty}
                    name="targetQty"
                    type="number"
                    onChange={(e) => {
                      rowDataChange(index, "targetQty", e?.target?.value);
                    }}
                  />
                </td>
              )}
            </tr>
          ))}
        </table>
      )}
    </>
  );
}
