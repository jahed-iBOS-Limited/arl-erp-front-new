/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

const header = [
  "SL",
  "Name",
  "Address",
  "Contact No.",
  "NID No",
  "Project Status",
  "Storied Type",
  "Start Date",
  "End Date (approximate)",
  "Action",
];

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
      {gridData?.objdata?.length > 0 && (
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
          {gridData?.objdata?.map((item, index) => {
            return (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td>{item?.strName}</td>
                <td>{item?.strPresentAddress}</td>
                <td>{item?.strContactNumber}</td>
                <td>{item?.strNationalId}</td>
                <td>{item?.strProjectStatus}</td>
                <td>{item?.strStroyedTye}</td>
                <td>{_dateFormatter(item?.dteStartDate)}</td>
                <td>{_dateFormatter(item?.dteEndDate)}</td>
                <td></td>
              </tr>
            );
          })}
        </table>
      )}
      {gridData?.objdata?.length > 0 && (
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
