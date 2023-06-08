import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
// eslint-disable-next-line no-unused-vars
import { getGridData } from "../helper";
import { SearchForm } from "./form";
import ICustomCard from "../../../../_helper/_customCard";
import { setPurchaseLanding_Action } from "../../../../_helper/reduxForLocalStorage/Actions";

export function TableRow() {
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const [taxBranchDDL, setTaxBranchDDL] = useState([]);
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
  const purchaseLanding = useSelector((state) => {
    return state.localStorage.purchaseLanding;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const commonGridDataFunc = (values, pageNo, pageSize, searchValue) => {
    getGridData(
      profileData.accountId,
      selectedBusinessUnit?.value,
      values?.taxBranch?.value,
      values.fromDate,
      values.toDate,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      searchValue
    );
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    commonGridDataFunc(values, pageNo, pageSize, null);
  };
  const paginationSearchHandler = (searchValue, values) => {
    commonGridDataFunc(values, pageNo, pageSize, searchValue);
  };


  useEffect(() => {
    if (
      profileData.accountId &&
      selectedBusinessUnit?.value &&
      taxBranchDDL[0]?.value
    ) {
      getGridData(
        profileData.accountId,
        selectedBusinessUnit?.value,
        purchaseLanding?.taxBranch?.value || taxBranchDDL[0]?.value,
        purchaseLanding?.fromDate,
        purchaseLanding?.toDate,
        setGridData,
        setLoading,
        pageNo,
        pageSize
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, taxBranchDDL, purchaseLanding]);

  return (
    <>
      <ICustomCard title="Purchase (6.4)">
        <SearchForm
          setTaxBranchDDL={setTaxBranchDDL}
          taxBranchDDL={taxBranchDDL}
          onSubmit={(values) => {
            dispatch(setPurchaseLanding_Action(values));
            setGridData([])
            getGridData(
              profileData.accountId,
              selectedBusinessUnit?.value,
              values.taxBranch.value,
              values.fromDate,
              values.toDate,
              setGridData,
              setLoading,
              pageNo,
              pageSize
            );
          }}
          loading={loading}
          setLoading={setLoading}
          gridData={gridData}
          setPositionHandler={setPositionHandler}
          paginationState={{
            pageNo,
            setPageNo,
            pageSize,
            setPageSize,
          }}
          paginationSearchHandler={paginationSearchHandler}
        />
      </ICustomCard>
    </>
  );
}
