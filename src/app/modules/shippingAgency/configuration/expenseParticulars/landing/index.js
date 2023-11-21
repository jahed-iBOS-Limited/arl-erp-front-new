import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { categoryDDL, getExpenseParticularsLandingApi } from "../helper";
import LandingTable from "./table";
import { _todayDate } from "../../../../_helper/_todayDate";

const initData = {
  category: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const ExpenseParticularsLanding = () => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const history = useHistory();
  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (accId && buId) {
      commonGridData(pageNo, pageSize, initData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const commonGridData = (
    _pageNo = pageNo,
    _pageSize = pageSize,
    values,
    searhValue
  ) => {
    getExpenseParticularsLandingApi(
      values?.category?.label,
      values?.fromDate,
      values?.toDate,
      pageNo,
      pageSize,
      setGridData,
      setLoading
    );
  };
  return (
    <>
      {loading && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, touched, errors }) => (
          <>
            <ICustomCard
              title='Expense Particulars'
              createHandler={() => {
                history.push(
                  `/ShippingAgency/Configuration/ExpenseParticulars/Create`
                );
              }}
            >
              <div className='row global-form my-3'>
                <div className='col-lg-3'>
                  <NewSelect
                    options={categoryDDL || []}
                    name='category'
                    onChange={(valueOption) => {
                      setFieldValue("category", valueOption);
                      setGridData([]);
                    }}
                    placeholder='Category'
                    label='Category'
                    value={values?.category}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col-lg-3'>
                  <label>From Date</label>
                  <InputField
                    value={values?.fromDate}
                    name='fromDate'
                    placeholder='From Date'
                    type='date'
                    onChange={(e) => {
                      setFieldValue("fromDate", e?.target?.value);
                    }}
                  />
                </div>
                <div className='col-lg-3'>
                  <label>To Date</label>
                  <InputField
                    value={values?.toDate}
                    name='toDate'
                    placeholder='To Date'
                    type='date'
                    onChange={(e) => {
                      setFieldValue("toDate", e?.target?.value);
                    }}
                  />
                </div>

                <div className='col d-flex align-items-end justify-content-end'>
                  <button
                    className='btn btn-primary mt-3'
                    onClick={() => {
                      commonGridData(1, pageSize, values);
                    }}
                    disabled={
                      !values?.category?.label ||
                      !values?.fromDate ||
                      !values?.toDate
                    }
                  >
                    View
                  </button>
                </div>
              </div>
              <LandingTable
                obj={{
                  gridData,
                  commonGridDataCB: () => {
                    commonGridData(pageNo, pageSize, values);
                  },
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

export default ExpenseParticularsLanding;
