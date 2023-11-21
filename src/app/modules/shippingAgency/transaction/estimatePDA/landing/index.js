import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  getExpensePDALandingApi,
  getSBUListDDLApi,
  getVesselDDL,
  getVoyageNoDDLApi
} from "../helper";
import LandingTable from "./table";

const initData = {
  
  sbu: "",
  vesselName: "",
  voyageNo: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const EstimatePDALanding = () => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const history = useHistory();
  const [vesselDDL, setVesselDDL] = useState([]);
  const [sbuDDL, setSbuDDL] = useState([]);
  const [voyageNoDDLApi, setVoyageNoDDLApi] = useState([]);

  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (accId && buId) {
      getVesselDDL(accId, buId, setVesselDDL);
      getSBUListDDLApi(accId, buId, setSbuDDL);
      commonGridData(pageNo, pageSize, initData);
      getVoyageNoDDLApi(accId, buId, setVoyageNoDDLApi);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const commonGridData = (
    _pageNo = pageNo,
    _pageSize = pageSize,
    values,
    searhValue
  ) => {
    getExpensePDALandingApi(
      values?.sbu?.value,
      values?.vesselName?.value,
      values?.voyageNo?.value,
      values?.fromDate,
      values?.toDate,
      pageNo,
      pageSize,
      setGridData,
      setLoading,
    )
  };
  return (
    <>
      {loading && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, touched, errors }) => (
          <>
            <ICustomCard
              title='Estimate PDA'
              createHandler={() => {
                history.push(`/ShippingAgency/Transaction/EstimatePDA/Create`);
              }}
            >
              <div className='row global-form my-3'>
                <div className='col-lg-3'>
                  <NewSelect
                    isSearchable={true}
                    options={sbuDDL || []}
                    name='sbu'
                    onChange={(valueOption) => {
                      setFieldValue("sbu", valueOption);
                      setGridData([]);
                    }}
                    placeholder='SBU'
                    value={values?.sbu}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col-lg-3'>
                  <NewSelect
                    value={values?.vesselName || ""}
                    isSearchable={true}
                    options={vesselDDL || []}
                    name='vesselName'
                    placeholder='Vessel Name'
                    label='Vessel Name'
                    onChange={(valueOption) => {
                      setFieldValue("vesselName", valueOption);
                      setGridData([]);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col-lg-3'>
                  <NewSelect
                    value={values?.voyageNo || ""}
                    isSearchable={true}
                    options={voyageNoDDLApi || []}
                    name='voyageNo'
                    placeholder='Voyage No'
                    label='Voyage No'
                    onChange={(valueOption) => {
                      setFieldValue("voyageNo", valueOption);
                      setGridData([]);
                    }}
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
                    disabled={
                      !values?.fromDate ||
                      !values?.toDate ||
                      !values?.sbu?.value ||
                      !values?.vesselName?.value
                    }
                  >
                    View
                  </button>
                </div>
              </div>

              {/* <PaginationSearch
                placeholder='Search By Issue, Code, Name'
                paginationSearchHandler={(searchValue) => {
                  commonGridData(1, pageSize, values, searchValue);
                }}
                values={values}
              /> */}
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

export default EstimatePDALanding;
