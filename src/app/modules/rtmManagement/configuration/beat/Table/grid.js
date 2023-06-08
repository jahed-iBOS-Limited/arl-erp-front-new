import React from "react";
import { withRouter } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import PaginationTable from './../../../../_helper/_tablePagination';
import IEdit from './../../../../_helper/_helperIcons/_edit';
import { useHistory } from "react-router-dom";

const GridData = ({
  rowDto,
  loading,
  setPositionHandler,
  pageNo,
  pageSize,
  setPageNo,
  setPageSize,
  values
  
}) => {
  const history = useHistory();
  
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
        {loading && <Loading />}
          <table className="table table-striped table-bordered global-table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Market Name</th>
                <th>Route Name</th>
                <th>Territory Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rowDto?.data?.length > 0 &&
                rowDto?.data?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td style={{ width: "30px" }} className="text-center">
                        {index + 1}
                      </td>
                      <td>
                        <span className="pl-2">{item?.beatName}</span>
                      </td>
                      <td>
                        <span className="pl-2">{item?.routeName}</span>
                      </td>
                      <td>
                        <span className="pl-2">{item?.territoryName}</span>
                      </td>
                      <td style={{ width: "100px" }} className="text-center">
                        <span
                          className="edit"
                          onClick={(e) =>
                            history.push(
                              `/rtm-management/configuration/beat/edit/${item?.beatId}`
                            )
                          }
                        >
                          <IEdit />
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          {/* Pagination Code */}
          {rowDto?.data?.length > 0 && (
            <PaginationTable
              count={rowDto?.totalCount}
              setPositionHandler={setPositionHandler}
              paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
              values={values}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default withRouter(GridData);
