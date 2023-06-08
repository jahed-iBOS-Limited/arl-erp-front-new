import React from "react";
import { withRouter } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import { useHistory } from "react-router";
import IEdit from "./../../../../_helper/_helperIcons/_edit";
import PaginationTable from "./../../../../_helper/_tablePagination";
import PaginationSearch from "./../../../../_helper/_search";
const GridData = ({
  rowDto,
  loading,
  setPositionHandler,
  pageNo,
  pageSize,
  setPageSize,
  setPageNo,
  paginationSearchHandler,
}) => {
  const history = useHistory();
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <PaginationSearch
            placeholder="Profile Name Search"
            paginationSearchHandler={paginationSearchHandler}
          />
          <div className="table-responsive">
            <table className="table table-striped table-bordered mt-1 global-table">
              <thead>
                <tr>
                  <th style={{ width: "20px" }}>SL</th>
                  <th style={{ width: "20px" }}>Profile Id</th>
                  <th style={{ width: "220px" }}>Profile Name</th>
                  <th style={{ width: "20px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && <Loading />}
                {rowDto?.data?.map((tableData, index) => (
                  <tr key={index}>
                    <td> {tableData.sl} </td>
                    <td> {tableData.itemProfileId} </td>
                    <td> {tableData.itemProfileName} </td>
                    <td className="text-center">
                      <span
                        className="edit"
                        onClick={() => {
                          history.push({
                            pathname: `/config/material-management/itemProfileSetup/edit/${tableData?.itemProfileId}`,
                          });
                        }}
                      >
                        <IEdit />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rowDto?.data?.length > 0 && (
            <PaginationTable
              count={rowDto?.totalCount}
              setPositionHandler={setPositionHandler}
              paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default withRouter(GridData);
