import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { getCostCenterData } from "../_redux/Actions";
import Loading from "./../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import { useHistory } from "react-router-dom";
import IEdit from "./../../../../_helper/_helperIcons/_edit";

export function TableRow() {
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const dispatch = useDispatch();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get grid data  from store
  const gridData = useSelector((state) => {
    return state.costElement?.gridData;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getCostCenterData(
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
  const setPositionHandler = (pageNo, pageSize) => {
    dispatch(
      getCostCenterData(
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
      {loading && <Loading />}
      <div className="table-responsive">
        <table
          className="table table-striped table-bordered global-table"
          style={{ width: "100%" }}
        >
          <thead>
            <tr>
              <th>Sl</th>
              <th>Code</th>
              <th>Element Name</th>
              <th>Controlling Unit</th>
              <th>Allocation Based</th>
              <th>General Ledger</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {gridData?.data?.map((data, index) => (
              <tr key={index}>
                <td>{data?.sl}</td>
                <td>
                  <div className="pl-2">{data?.costElementCode}</div>
                </td>
                <td>
                  <div className="pl-2">{data?.costElementName}</div>
                </td>
                <td>
                  <div className="pl-2">{data?.controllingUnitName}</div>
                </td>
                <td>
                  <div className="pl-2">
                    {data?.allocationBased === true ? "Yes" : "No"}
                  </div>
                </td>
                <td>
                  <div className="pl-2">{data?.generalLedgerName}</div>
                </td>
                <td className="text-center">
                  <span
                    onClick={() =>
                      history.push({
                        pathname: `/financial-management/cost-controlling/costelement/edit/${data?.costElementId}`,
                      })
                    }
                  >
                    <IEdit />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>{" "}
      </div>

      {gridData?.data?.length > 0 && (
        <PaginationTable
          count={gridData?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
        />
      )}
    </>
  );
}
