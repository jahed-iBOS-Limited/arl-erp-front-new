import React from "react";

import { withRouter } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import PaginationSearch from "../../../../_helper/_search";
import PaginationTable from "../../../../_helper/_tablePagination";

const GridData = ({
  rowdata,
  itemData,
  allGridCheck,
  loading,
  ReportType,
  gridDataFunc,
  gridData,
  paginationState,
  values,
}) => {
  const paginationSearchHandler = (searchValue) => {
    gridDataFunc(values, pageNo, pageSize, searchValue);
  };
  const setPositionHandler = (pageNo, pageSize, values) => {
    gridDataFunc(values, pageNo, pageSize);
  };
  const { pageNo, setPageNo, pageSize, setPageSize } = paginationState;
  return (
    <>
      <PaginationSearch
        placeholder="Item Name & Code Search"
        paginationSearchHandler={paginationSearchHandler}
      />
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              {ReportType !== "Complete" && (
                <th>
                  <input
                    label="Select"
                    type="checkbox"
                    id="isForDepartment"
                    onChange={(event) => {
                      allGridCheck(event.target.checked);
                    }}
                  />
                </th>
              )}
              <th>SL No</th>
              <th>Delivery Date</th>
              <th>Delivery Code</th>
              <th>Customer Code</th>
              <th>Customer Name</th>
              <th>Customer Address</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading && <Loading />}
            {rowdata?.map((td, index) => {
              return (
                <tr>
                  {ReportType !== "Complete" && (
                    <td align="center">
                      <input
                        id="isForDepartment"
                        type="checkbox"
                        className=""
                        value={td.itemcheck || ""}
                        checked={td.itemcheck}
                        name={td.itemcheck}
                        onChange={(e) => {
                          itemData(index);
                        }}
                      />
                    </td>
                  )}
                  <td> {index + 1} </td>
                  <td> {_dateFormatter(td.deliveryDate)} </td>
                  <td> {td.deliveryCode} </td>
                  <td> {td.billToPartnerCode} </td>
                  <td> {td.billToPartnerName} </td>
                  <td>
                    {td.shipToPartnerName}, {td.shipToPartnerAddress}{" "}
                  </td>
                  <td className="text-center"> {td.totalNetValue} </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {gridData?.data?.length > 0 && (
        <PaginationTable
          count={gridData?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          values={values}
          rowsPerPageOptions={[5, 10, 20, 50, 100, 200]}
        />
      )}
    </>
  );
};

export default withRouter(GridData);
