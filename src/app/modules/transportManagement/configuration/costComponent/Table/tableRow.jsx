import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import { getTransportrouteCCPagination } from "../helper";
import PaginationTable from "./../../../../_helper/_tablePagination";

export function TableRow() {
  // eslint-disable-next-line no-unused-vars
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const history = useHistory();
  // get user profile data from store
  // eslint-disable-next-line no-unused-vars
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  // eslint-disable-next-line no-unused-vars
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getTransportrouteCCPagination(
        profileData?.accountId,
        pageNo,
        pageSize,
        setGridData,
        setLoading
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    getTransportrouteCCPagination(
      profileData?.accountId,
      pageNo,
      pageSize,
      setGridData,
      setLoading,
      searchValue
    );
  };
  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  const pushData = () => {
    history.push({
      pathname: "/transport-management/configuration/costcomponent/add",
    });
  };
  return (
    <ICustomCard
      title="Cost Component"
      renderProps={() => (
        <button className="btn btn-primary" onClick={pushData}>
          Create new
        </button>
      )}
    >
      {loading && <Loading />}
      <Formik>
        <>
          <div className="row cash_journal">
            <div className="col-lg-12 pr-0 pl-0">
              <PaginationSearch
                placeholder="Cost Component Name Search"
                paginationSearchHandler={paginationSearchHandler}
              />
              <div className="table-responsive">
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Cost Component Name</th>
                    <th>General Ledger Name</th>
                    <th style={{ width: "70px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.objdata?.length > 0 &&
                    gridData?.objdata?.map((item, index) => (
                      <tr>
                        <td className="text-center">{item?.sl}</td>
                        <td>
                          <div className="pl-2">
                            {item?.transportRouteCostComponent}
                          </div>
                        </td>
                        <td>
                          <div className="pl-2">
                            {item?.generalLedgerName}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-around">
                            <span className="view">
                              <IView
                                clickHandler={() => {
                                  history.push(
                                    `/transport-management/configuration/costcomponent/view/${item?.transportRouteCostComponentId}`
                                  );
                                }}
                              />
                            </span>
                            <span
                              className="edit"
                              onClick={() => {
                                history.push(
                                  `/transport-management/configuration/costcomponent/edit/${item?.transportRouteCostComponentId}`
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
              {gridData?.objdata?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                />
              )}
            </div>
          </div>
        </>
      </Formik>
    </ICustomCard>
  );
}
