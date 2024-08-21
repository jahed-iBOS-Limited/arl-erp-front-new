/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  complainLandingPasignation,
  getBusinessUnitDDLApi,
  getComplainCategory,
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
  respondentBusinessUnit: {
    value: 0,
    label: "All",
  },
  issueType: {
    value: 0,
    label: "All",
  },
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const ComplainLanding = () => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const history = useHistory();
  const [complainStatus, setComplainStatus] = useState([]);
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [complainCategory, setComplainCategory] = useState([]);
  // get user data from store
  const {
    profileData: { accountId: accId, },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (accId && buId) {
      // employeEnroll_Api(accId, buId, SetEmployeeDDL);
      getComplainStatus(buId, setComplainStatus);
      commonGridData(pageNo, pageSize, initData);
      getBusinessUnitDDLApi(accId, setBusinessUnitDDL);
      getComplainCategory(buId, setComplainCategory);
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
      values?.respondentBusinessUnit?.value || 0,
      values?.respondentType?.value || 0,
      values?.fromDate,
      values?.toDate,
      values?.status?.value || 0,
      values?.issueType?.value || 0,
      _pageNo,
      _pageSize,
      setGridData,
      setLoading,
      searhValue,
      values?.respondentBusinessUnit?.value,
    );
  };
  return (
    <>
      {loading && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, touched, errors }) => (
          <>
            <ICustomCard
              title='Feedback'
              createHandler={() => {
                history.push(
                  `/sales-management/complainmanagement/complain/entry`
                );
              }}
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
                    name='respondentBusinessUnit'
                    options={[{value:0, label:"All"}, ...businessUnitDDL] || []}
                    value={values?.respondentBusinessUnit}
                    label='Respondent Business Unit'
                    onChange={(valueOption) => {
                      setFieldValue(
                        "respondentBusinessUnit",
                        valueOption || ""
                      );
                     
                    }}                   
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
                  <NewSelect
                    name='issueType'
                    options={[
                      {
                        value: 0,
                        label: "All",
                      },
                      ...complainCategory,
                    ] || []}
                    value={values?.issueType}
                    label='Issue Type'
                    onChange={(valueOption) => {
                      setFieldValue("issueType", valueOption || "");
                      setGridData([]);
                    }}
                    placeholder='Issue Type'
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
                <div className='mt-3'>
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
                  },
                  setLoading
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

export default ComplainLanding;
