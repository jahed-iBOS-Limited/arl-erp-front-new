import React from "react";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import PaginationTable from "../../../../../_helper/_tablePagination";

const ShipmentPointAndTerritoryTable = ({
  values,
  pageNo,
  setPageNo,
  pageSize,
  setPageSize,
  handleGetRowData,
  rowData,
}) => {
  const setPositionHandler = (pageNo, pageSize, values) => {
    handleGetRowData(values, pageNo, pageSize);
  };
  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th style={{ width: "35px" }}>SL</th>
              <th>Area</th>
              <th>Territory</th>
              <th>Ship Point</th>
              <th>Insert By</th>
              <th>Insertion Date</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {rowData?.data?.map((item, index) => (
              <tr key={item?.teritoryId}>
                <td> {index + 1} </td>
                <td> {item.areaName} </td>
                <td> {item.teritoryName} </td>
                <td> {item.shipPointName} </td>
                <td> {item.insertById} </td>
                <td> {_dateFormatter(item.insertDate)} </td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rowData?.data?.length > 0 && (
        <PaginationTable
          count={rowData?.totalCount}
          setPositionHandler={setPositionHandler}
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

export default ShipmentPointAndTerritoryTable;
