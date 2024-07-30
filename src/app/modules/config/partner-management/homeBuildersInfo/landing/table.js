/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import PaginationTable from "../../../../_helper/_tablePagination";

const header = ["SL", "Month", "Year", "ShipPoint", "Target Qty", "Action"];

const HomeBuildersInfoLandingTable = ({ obj }) => {
  const {
    pageNo,
    values,
    gridData,
    getData,
    pageSize,
    setPageNo,
    setPageSize,
  } = obj;

  return (
    <>
      {gridData?.data?.length > 0 && (
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
          {gridData?.data?.map((item, index) => {
            return (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>

                <td>{item?.targetYearId}</td>
              </tr>
            );
          })}
        </table>
      )}
      {gridData?.data?.length > 0 && (
        <PaginationTable
          count={gridData?.totalCount}
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

export default HomeBuildersInfoLandingTable;
