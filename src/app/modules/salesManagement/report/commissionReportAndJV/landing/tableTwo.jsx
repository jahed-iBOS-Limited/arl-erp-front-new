/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IButton from "../../../../_helper/iButton";
import { cancelJV } from "../helper";

const headers = [
  "SL",
  "Customer Name",
  "Target Qty",
  "Delivery Quantity",
  "Achievement",
  "Commission",
  "Journal Code",
];

const CommissionReportAndJVTableTwo = ({ obj }) => {
  const {
    values,
    rowData,
    setLoading,
    // allSelect, selectedAll, rowDataHandler
  } = obj;

  return (
    <>
      {rowData?.length > 0 && (
        <>
          {" "}
          <IButton
            className={"btn-danger"}
            onClick={() => {
              cancelJV(
                values?.type?.value,
                values?.month?.value,
                values?.year?.value,
                setLoading
              );
            }}
          >
            Cancel JV
          </IButton>
          <table
            className={
              "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
            }
          >
            <thead>
              <tr
              //   onClick={() => allSelect(!selectedAll())}
              //   className="cursor-pointer"
              >
                {/* <th style={{ width: "40px" }}>
                <input
                  type="checkbox"
                  value={selectedAll()}
                  checked={selectedAll()}
                  onChange={() => {}}
                />
              </th> */}
                {headers.map((th, index) => {
                  return <th key={index}> {th} </th>;
                })}
              </tr>
            </thead>
            <tbody>
              {rowData?.map((item, index) => {
                return (
                  <tr className="cursor-pointer" key={index}>
                    {/* <td
                    onClick={() => {
                      rowDataHandler(index, "isSelected", !item.isSelected);
                    }}
                    className="text-center"
                    style={
                      item?.isSelected
                        ? {
                            backgroundColor: "#aacae3",
                            width: "40px",
                          }
                        : { width: "40px" }
                    }
                  >
                    <input
                      type="checkbox"
                      value={item?.isSelected}
                      checked={item?.isSelected}
                      onChange={() => {}}
                    />
                  </td> */}
                    <td style={{ width: "40px" }} className="text-center">
                      {index + 1}
                    </td>
                    <td>{item?.customerName}</td>
                    <td className="text-right">
                      {_fixedPoint(item?.targetQty, true)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(item?.deliveryQty, true, 4)}
                    </td>{" "}
                    <td className="text-right">
                      {_fixedPoint(item?.achievement, true)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(item?.commissiontaka, true)}
                    </td>
                    <td>{item?.accountingjournalcode}</td>
                  </tr>
                );
              })}
              <tr style={{ textAlign: "right", fontWeight: "bold" }}>
                <td colSpan={2} className="text-right">
                  Total
                </td>
                <td>
                  {_fixedPoint(
                    rowData?.reduce((acc, cur) => acc + cur?.targetQty, 0),
                    true
                  )}
                </td>
                <td>
                  {_fixedPoint(
                    rowData?.reduce((acc, cur) => acc + cur?.deliveryQty, 0),
                    true
                  )}
                </td>
                <td>
                  {_fixedPoint(
                    rowData?.reduce((acc, cur) => acc + cur?.achievement, 0),
                    true
                  )}
                </td>

                <td>
                  {_fixedPoint(
                    rowData?.reduce((acc, cur) => acc + cur?.commissiontaka, 0),
                    true
                  )}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default CommissionReportAndJVTableTwo;
