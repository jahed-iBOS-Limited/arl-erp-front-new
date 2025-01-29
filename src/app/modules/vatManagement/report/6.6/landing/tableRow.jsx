import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
// eslint-disable-next-line no-unused-vars
import { getGridDataSingleInvoice, getGenaratedGridData } from "../helper";
import { SearchForm } from "./form";
import ICustomCard from "../../../../_helper/_customCard";
import { _todayDate } from "./../../../../_helper/_todayDate";

export function TableRow() {
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const [taxBranchDDL, setTaxBranchDDL] = useState([]);
  const [gridDataOthers, setGridDataOthers] = useState([]);

  // paginationState
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
    if (selectedBusinessUnit?.value && profileData?.accountId) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getGridDataSingleInvoice(
      profileData.accountId,
      selectedBusinessUnit?.value,
      values?.taxBranch?.value,
      values.fromDate,
      values.toDate,
      setGridData,
      setLoading,
      pageNo,
      pageSize
    );
  };

  useEffect(() => {
    if (taxBranchDDL[0]?.value) {
      getGridDataSingleInvoice(
        profileData.accountId,
        selectedBusinessUnit?.value,
        taxBranchDDL[0]?.value,
        _todayDate(),
        _todayDate(),
        setGridData,
        setLoading,
        pageNo,
        pageSize
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxBranchDDL]);

  const onSubmitHandler = (values, setModal) => {
    if (values?.radio === "generate") {
      getGenaratedGridData(
        profileData.accountId,
        selectedBusinessUnit?.value,
        values?.taxBranch?.value,
        values.fromDate,
        values.toDate,
        setGridData,
        setLoading,
        pageNo,
        pageSize
      );
    } else {
      /* 
       viewType (Single Partner)  = 2 
      */
      if (values?.viewType?.value === 2) {
        getGridDataSingleInvoice(
          profileData.accountId,
          selectedBusinessUnit?.value,
          values?.taxBranch.value,
          values?.fromDate,
          values?.toDate,
          setGridData,
          setLoading,
          pageNo,
          pageSize
        );
      } else {
        setModal(true);
      }
    }
  };

  return (
    <>
      <ICustomCard title="VDS Certificate">
        <SearchForm
          setTaxBranchDDL={setTaxBranchDDL}
          taxBranchDDL={taxBranchDDL}
          onSubmit={(values, setModal) => onSubmitHandler(values, setModal)}
          loading={loading}
          gridData={gridData}
          setGridData={setGridData}
          gridDataOthers={gridDataOthers}
          setGridDataOthers={setGridDataOthers}
          setPositionHandler={setPositionHandler}
          paginationState={{
            pageNo,
            setPageNo,
            pageSize,
            setPageSize,
          }}
        />
      </ICustomCard>
    </>
  );
}
