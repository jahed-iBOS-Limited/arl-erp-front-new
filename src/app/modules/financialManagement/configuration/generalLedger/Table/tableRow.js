import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { getGeneralLedgerGridData } from "../_redux/Actions";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IExtend from "../../../../_helper/_helperIcons/_extend";
import Loading from "./../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";

export function TableRow() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
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

  // get controlling unit list  from store
  const gridData = useSelector((state) => {
    return state.generalLedger?.gridData;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getGeneralLedgerGridData(
          profileData.accountId,
          selectedBusinessUnit.value,
          setLoading,
          pageNo,
          pageSize
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    dispatch(
      getGeneralLedgerGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        setLoading,
        pageNo,
        pageSize,
        searchValue
      )
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  return (
    <>
      {/* Table Start */}
      <div className="row cash_journal">
        <div className="col-lg-12 pr-0 pl-0 ">
          <div className="d-flex justify-content-between">
            {" "}
            <PaginationSearch
              placeholder="GL Name  Search"
              paginationSearchHandler={paginationSearchHandler}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                history.push(
                  "/financial-management/configuration/general-ladger/allGlExtend"
                )
              }
            >
              All GL Extend
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Code</th>
                  <th>GL Name</th>
                  <th>Account Category</th>
                  <th>Account Class</th>
                  <th>Account Group</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && <Loading />}
                {gridData?.data?.map((item, index) => (
                  <tr key={item.generalLedgerId}>
                    <td> {item.sl}</td>
                    <td>
                      <div className="pl-2">{item.generalLedgerCode}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item.generalLedgerName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item.accountCategoryName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item.accountClassName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item.accountGroupName}</div>
                    </td>
                    <td>
                      <div className="d-flex justify-content-center">
                        <span
                          className="edit"
                          onClick={() => {
                            history.push(
                              `/financial-management/configuration/general-ladger/edit/${item.generalLedgerId}`
                            );
                          }}
                        >
                          <IEdit />
                        </span>
                        <span
                          className="extend ml-3"
                          onClick={() => {
                            history.push({
                              pathname: `/financial-management/configuration/general-ladger/extend/${item.generalLedgerId}`,
                              state: {
                                generalLedgerName: item.generalLedgerName,
                              },
                            });
                          }}
                        >
                          <IExtend />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
