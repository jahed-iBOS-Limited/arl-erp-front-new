import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { getBranchGridData } from "../_redux/Actions";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { useHistory } from "react-router-dom";
import IView from "../../../../_helper/_helperIcons/_view";
import IExtend from "../../../../_helper/_helperIcons/_extend";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";

export function TableRow() {
  const dispatch = useDispatch();
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

  // get controlling unit list  from store
  const gridData = useSelector((state) => {
    return state.taxBranch?.gridData;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getBranchGridData(
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

  const setPositionHandler = (pageNo, pageSize) => {
    dispatch(
      getBranchGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        setLoading,
        pageNo,
        pageSize
      )
    );
  };

  return (
    <>
      {/* Table Start */}
      <div className="row cash_journal">
        {loading && <Loading />}
        <div className="col-lg-12 pr-0 pl-0">
          <div className="react-bootstrap-table table-responsive">
            {gridData?.data?.length > 0 && (
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Branch Name</th>
                    <th>Branch Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.data?.map((item, index) => (
                    <tr key={item.taxBranchId}>
                      <td> {item.sl}</td>
                      <td>
                        <div className="pl-2">{item.taxBranchName}</div>
                      </td>
                      <td>
                        <div className="pl-2">{item.taxBranchAddress}</div>
                      </td>
                      <td>
                        <div className="d-flex justify-content-around">
                          <span className="view mx-1">
                            <IView
                              clickHandler={() => {
                                history.push(
                                  `/mngVat/cnfg-vat/branch/view/${item.taxBranchId}`
                                );
                              }}
                            />
                          </span>
                          <span
                            className="edit"
                            onClick={() => {
                              history.push(
                                `/mngVat/cnfg-vat/branch/edit/${item.taxBranchId}`
                              );
                            }}
                          >
                            <IEdit />
                          </span>
                          <span
                            className="mx-1"
                            onClick={() =>
                              history.push({
                                pathname: `/mngVat/cnfg-vat/branch/extend/${item?.taxBranchId}`,
                              })
                            }
                          >
                            <IExtend />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
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
