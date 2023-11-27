/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  complainLandingPasignation,
  getComplainStatus,
  respondentTypeDDL
} from "../helper";
import LandingTable from "./table";

const initData = {
  respondentType: {
    value: 0,
    label: "All",
  },
  status: {
    value: 0,
    label: "All",
  },
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const ResolutionLanding = () => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [complainStatus, setComplainStatus] = useState([]);
  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (accId && buId) {
      // employeEnroll_Api(accId, buId, SetEmployeeDDL);
      getComplainStatus(buId, setComplainStatus);
      commonGridData(pageNo, pageSize, initData);
    }
  }, [accId, buId]);



  const commonGridData = (
    _pageNo = pageNo,
    _pageSize = pageSize,
    values,
    searhValue
  ) => {
    complainLandingPasignation(
      accId,
      buId,
      values?.respondentType?.value || 0,
      values?.fromDate,
      values?.toDate,
      values?.status?.value || 0,
      pageNo,
      pageSize,
      setGridData,
      setLoading,
      searhValue
    );
  };

  return (
    <>
      {loading && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, touched, errors }) => (
          <>
            <ICustomCard
              title='Resolution'
              
            >
              <div className='row global-form my-3'>
                <div className='col-lg-3'>
                  <NewSelect
                    name='respondentType'
                    options={
                      [
                        {
                          value: 0,
                          label: "All",
                        },
                        ...respondentTypeDDL,
                      ] || []
                    }
                    value={values?.respondentType}
                    label='Respondent Type'
                    onChange={(valueOption) => {
                      setFieldValue("respondentType", valueOption || "");
                      setGridData([]);
                    }}
                    placeholder='Respondent Type'
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col-lg-3'>
                  <NewSelect
                    name='status'
                    options={
                      [
                        {
                          value: 0,
                          label: "All",
                        },
                        ...complainStatus,
                      ] || []
                    }
                    value={values?.status}
                    label='Status'
                    onChange={(valueOption) => {
                      setFieldValue("status", valueOption || "");
                      setGridData([]);
                    }}
                    placeholder='Status'
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col-lg-3'>
                  <InputField
                    value={values?.fromDate}
                    label='From Date'
                    name='fromDate'
                    type='date'
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                      setGridData([]);
                    }}
                  />
                </div>

                <div className='col-lg-3'>
                  <InputField
                    value={values?.toDate}
                    label='To Date'
                    name='toDate'
                    type='date'
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                      setGridData([]);
                    }}
                  />
                </div>
                <div className='col d-flex align-items-end justify-content-end'>
                  <button
                    className='btn btn-primary mt-3'
                    onClick={() => {
                      commonGridData(1, pageSize, values);
                    }}
                  >
                    View
                  </button>
                </div>
              </div>

              <PaginationSearch
                placeholder='Search By Issue, Code, Name'
                paginationSearchHandler={(searchValue) => {
                  commonGridData(1, pageSize, values, searchValue);
                }}
                values={values}
              />
              <LandingTable
                obj={{
                  gridData,
                  commonGridDataCB: () => {
                    commonGridData(pageNo, pageSize, values);
                  }
                }}
              />

              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={(pageNo, pageSize) => {
                    commonGridData(pageNo, pageSize, values);
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

export default ResolutionLanding;

