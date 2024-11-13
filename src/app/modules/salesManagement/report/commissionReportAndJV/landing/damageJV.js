/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

import { _dateFormatter } from "../../../../_helper/_dateFormate";

const header = (buId, values) => {
  const H_Four = [
    "SL",
    "Challan No",
    "Delivery Date",
    "Customer Name",
    "Customer Code",
    "Quantity",
    "Amount",
    "Entry Date",
    "Status",
  ];

  return H_Four;
};

const DamangeReportAndJVTable = ({ obj }) => {
  const {
    buId,
    values,
    rowData,
    allSelect,
    selectedAll,
    editCommission,
    rowDataHandler,
  } = obj;
  console.log({ rowData });
  return (
    <>
      {rowData?.length > 0 && (
        <table
          className={
            "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
          }
        >
          <thead>
            <tr
              onClick={() =>{
                if(values?.reportType?.value === 3) return;
                allSelect(!selectedAll())
              }}
              className="cursor-pointer"
            >
              {![26].includes(values?.type?.value) && (
                <th style={{ width: "40px" }}>
                  <input
                    type="checkbox"
                    value={selectedAll()}
                    checked={selectedAll()}
                    onChange={() => {}}
                    disabled={values?.reportType?.value === 3}
                  />
                </th>
              )}
              {header(buId, values).map((th, index) => {
                console.log(th);
                return <th key={index}> {th} </th>;
              })}
            </tr>
          </thead>
          <tbody>
            {rowData?.map((item, index) => {
              // totalQty += item?.deliveryQty;
              // totalCommission += item?.commissiontaka;
              // totalTargetQty += item?.targetQty;
              // totalAchievement += item?.achievement;

              return (
                <tr className="cursor-pointer" key={index}>
                  {![26].includes(values?.type?.value) && (
                    <td
                      onClick={() => {
                        if(values?.reportType?.value === 3) return;
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
                        disabled={values?.reportType?.value === 3}
                      />
                    </td>
                  )}
                  <td style={{ width: "40px" }} className="text-center">
                    {index + 1}
                  </td>
                  <td>{item?.deliveryChallan}</td>
                  <td>
                    {item?.deliveryDate
                      ? _dateFormatter(item?.deliveryDate)
                      : "-"}
                  </td>
                  <td>{item?.businessPartnerName}</td>
                  <td>{item?.businessPartnerCode}</td>

                  <td>{item?.totalReturnQty}</td>
                  <td>{item?.totalReturnAmount}</td>
                  <td>
                    {item?.returnDateTime
                      ? _dateFormatter(item?.returnDateTime)
                      : "-"}
                  </td>
                  <td>
                    {item?.isApprovedBySupervisor && item?.isApprovedByAccount
                      ? "Approved By Supervisor And Account"
                      : item?.isApprovedBySupervisor
                      ? "Approved By Supervisor"
                      : "Approved By Account"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
};

export default DamangeReportAndJVTable;
