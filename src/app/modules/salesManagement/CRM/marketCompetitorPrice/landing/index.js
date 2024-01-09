/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";

import LandingTable from "./table";
import useAxiosGet from "./../../../../_helper/customHooks/useAxiosGet";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { _todayDate } from "./../../../../_helper/_todayDate";

const initData = {
  businessUnit: "",
  channel: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const MarketCompetitorPriceLanding = () => {
  const [gridData, setGridData] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const history = useHistory();
  const [, setCompetitorPriceLandingPag, landingLoading] = useAxiosGet();
  const [businessUnitDDL, setBusinessUnitDDL] = useAxiosGet([]);
  const [channelList, setDDLChannelList, rowListLoading] = useAxiosGet();
  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (accId && buId) {
      setBusinessUnitDDL(
        `/domain/BusinessUnitDomain/GetBusinessUnitDDL?AccountId=${accId}&BusinessUnitId=0`
      );
      setDDLChannelList(`/oms/CompetitorChannel/GetDDLCompetitorChannelList`);
    }
  }, [accId, buId]);

  const commonGridData = (
    _pageNo = pageNo,
    _pageSize = pageSize,
    values,
    searhValue
  ) => {
    setCompetitorPriceLandingPag(
      `/oms/CompetitorPrice/GetCompetitorPriceLandingPagination?businessUntId=${values?.value}&ChannelId=${values?.channel?.value}&fromDate=2024-01-01&toDate=2024-01-09&PageNo=${_pageNo}&PageSize=${pageSize}&viewOrder=desc`,
      (resData) => {
        setGridData(resData);
      }
    );
  };
  return (
    <>
      {(landingLoading || rowListLoading) && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, touched, errors }) => (
          <>
            <ICustomCard
              title='Market Competitor Price'
              createHandler={() => {
                history.push(
                  `/sales-management/CRM/MarketCompetitorPrice/entry`
                );
              }}
            >
              {/* <PaginationSearch
                placeholder='Search By Issue, Code, Name'
                paginationSearchHandler={(searchValue) => {
                  commonGridData(1, pageSize, values, searchValue);
                }}
                values={values}
              /> */}
              <div className='row global-form my-3'>
                <div className='col-lg-3'>
                  <NewSelect
                    isRequiredSymbol={true}
                    name='businessUnit'
                    options={businessUnitDDL || []}
                    value={values?.businessUnit}
                    label='Business Unit'
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption || "");
                      setFieldValue("territory", "");
                    }}
                    placeholder='Select Business Unit'
                  />
                </div>
                <div className='col-lg-3'>
                  <NewSelect
                    isRequiredSymbol={true}
                    name='channel'
                    options={channelList || []}
                    value={values?.channel}
                    label='Channel'
                    onChange={(valueOption) => {
                      setFieldValue("channel", valueOption || "");
                    }}
                    placeholder='Select Channel'
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
                      !values?.businessUnit ||
                      !values?.channel ||
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

export default MarketCompetitorPriceLanding;
