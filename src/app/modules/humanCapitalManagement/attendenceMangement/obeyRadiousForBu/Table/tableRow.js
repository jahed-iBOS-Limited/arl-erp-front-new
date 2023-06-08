import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import { GetObeyRadiusLandingPagination } from "../helper";

export function TableRow() {
  // eslint-disable-next-line no-unused-vars
  const [gridData, setGridData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetObeyRadiusLandingPagination(
        profileData?.accountId,
        pageNo,
        pageSize,
        setLoading,
        setGridData
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    // landing api needed
  };

  return (
    <>
      <div className="row cash_journal">
        {loading && <Loading />}
        <div className="col-lg-12 pr-0 pl-0">
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
            <thead>
              <tr>
                <th>SL</th>
                <th>Business Unit</th>
                <th>Obey Radius (Meter)</th>
                <th style={{ width: "60px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.data?.map((item, index) => (
                <tr>
                  {/* key={item.businessUnitId} */}
                  <td> {item.sl}</td>
                  <td>
                    <div className="pl-2">{item?.businessUnitName}</div>
                  </td>
                  <td>{item.numObeyRadius}</td>
                  <td>
                    <div className="d-flex justify-content-around">
                      <span
                        className="edit"
                        onClick={() => {
                          history.push(
                            `/human-capital-management/attendancemgt/obeyRadiusForBusinessUnit/edit/${item.obeyRadiusForBusinessUnitId}`
                          );
                        }}
                      >
                        <IEdit />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          {gridData?.data?.length > 0 && (
            <PaginationTable
              count={gridData?.totalCount}
              setPositionHandler={setPositionHandler}
              paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
            />
          )}
        </div>
      </div>
    </>
  );
}
