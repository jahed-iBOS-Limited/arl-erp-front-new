/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import LandingTable from "./table";
import PaginationSearch from "./../../../../_helper/_search";
import {
  complainLandingPasignation,
  employeEnroll_Api,
  getComplainStatus,
  updateComplain,
} from "../helper";

const initData = {};

const ComplainLanding = () => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const history = useHistory();
  const [employeeDDL, SetEmployeeDDL] = useState([]);
  const [complainStatus, setComplainStatus] = useState([]);
  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (accId && buId) {
      employeEnroll_Api(accId, buId, SetEmployeeDDL);
      getComplainStatus(buId, setComplainStatus);
      commonGridData();
    }
  }, [accId, buId]);

  const assignToAndStatusHandler = (payload) => {
    updateComplain(payload, setLoading, () => {
      commonGridData();
    });
  };

  const commonGridData = (
    _pageNo = pageNo,
    _pageSize = pageSize,
    searhValue
  ) => {
    complainLandingPasignation(
      accId,
      buId,
      _pageNo,
      _pageSize,
      setGridData,
      setLoading,
      searhValue
    );
  };
  return (
    <>
      {loading && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue }) => (
          <>
            <ICustomCard
              title='Complain'
              createHandler={() => {
                history.push(
                  `/sales-management/ordermanagement/Complain/entry`
                );
              }}
            >
              <PaginationSearch
                placeholder='Search .....'
                paginationSearchHandler={(searchValue) => {
                  commonGridData(1, pageSize, searchValue);
                }}
                values={values}
              />
              <LandingTable
                obj={{
                  gridData,
                  employeeDDL,
                  complainStatus,
                  assignToAndStatusHandler,
                }}
              />

              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={(pageNo, pageSize) => {
                    commonGridData(pageNo, pageSize);
                  }}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                />
              )}
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default ComplainLanding;
