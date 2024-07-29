/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import PaginationTable from "../../../../_helper/_tablePagination";
import { getMonth } from "../../customerSalesTarget/utils";

const header = ["SL", "Month", "Year", "ShipPoint", "Target Qty", "Action"];

const ShipToPartyTargetLandingTable = ({ obj }) => {
  const {
    pageNo,
    values,
    rowData,
    getData,
    pageSize,
    setPageNo,
    setPageSize,
  } = obj;

  return (
    <>
      {rowData?.data?.length > 0 && (
        <table
          className={
            "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
          }
        >
          <thead>
            <tr className="cursor-pointer">
              {header?.map((item) => (
                <th key={item}>{item}</th>
              ))}
            </tr>
          </thead>
          {rowData?.data?.map((item, index) => {
            return (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>

                <td>{getMonth(item?.targetMonthId)}</td>
                <td>{item?.targetYearId}</td>
              </tr>
            );
          })}
        </table>
      )}
      {rowData?.data?.length > 0 && (
        <PaginationTable
          count={rowData?.totalCount}
          setPositionHandler={(pageNo, pageSize) => {
            getData(values, pageNo, pageSize);
          }}
          paginationState={{
            pageNo,
            setPageNo,
            pageSize,
            setPageSize,
          }}
        />
      )}
    </>
  );
};

export default ShipToPartyTargetLandingTable;
