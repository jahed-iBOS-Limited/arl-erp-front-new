import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { useHistory } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import { getRouteLanding } from "../helper";

export function TableRow() {
  // eslint-disable-next-line no-unused-vars
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, setGridData] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      getRouteLanding(
        profileData.accountId,
        selectedBusinessUnit.value,
        setLoading,
        pageNo,
        pageSize,
        setGridData
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getRouteLanding(
      profileData.accountId,
      selectedBusinessUnit.value,
      setLoading,
      pageNo,
      pageSize,
      setGridData
    );
  };

  return (
    <>
      {/* Table Start */}
      <div className="row cash_journal">
        {loading && <Loading />}
        <div className="col-lg-12 pr-0 pl-0">
          {gridData?.data?.length > 0 && (
            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Route Name</th>
                  <th>Territory Name</th>
                  <th>Start Outlet Name</th>
                  <th>End Outlet Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.data?.map((item, index) => (
                  <tr key={index}>
                    <td> {item?.sl}</td>
                    <td>
                      <div className="pl-2">{item?.routeName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item?.territoryName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item?.startOutletName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item?.endOutletName}</div>
                    </td>
                    <td>
                      <div className="d-flex justify-content-around">
                        <span
                          className="edit"
                          onClick={() => {
                            history.push(
                              `/rtm-management/configuration/route/edit/${item?.routeId}`
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
          )}
        </div>
        {gridData?.data?.length > 0 && (
          <PaginationTable
            count={gridData?.totalCount}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )}
      </div>
    </>
  );
}
