/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { shallowEqual, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  CardHeader,
  ModalProgressBar,
} from '../../../../../../_metronic/_partials/controls';
import FromDateToDateForm from '../../../../_helper/commonInputFieldsGroups/dateForm';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import { _todayDate } from '../../../../_helper/_todayDate';
import { YearDDL } from '../../../../_helper/_yearDDL';
import {
  getCustomerNameDDL,
  GetSalesOrganizationDDL_api,
} from '../../shipToPartyDelivery/helper';
import {
  getAchievementReports,
  getNetToCompanyData,
  getUserLoginInfo,
} from '../helper';
import SalesOfficersKPIReport from '../report/SalesOfficersKPIReport';
import RetailAndDistributorAchievementTable, {
  NetToCompanyTable,
} from './table';
import { monthDDL } from '../../salesanalytics/utils';

const reportTypes = [
  { value: 1, label: 'Retail and Distributor increase' },
  { value: 2, label: 'Target Vs Achievement' },
  { value: 3, label: 'Revenue Target & Collection' },
  { value: 4, label: 'Mortgage Vs Sales' },
  { value: 5, label: 'Net to company' },
  { value: 6, label: 'Sales Officers KPI' },
];

const initData = {
  reportType: '',
  type: '',
  month: '',
  year: '',
  fromDate: _todayDate(),
  toDate: _todayDate(),
  allowBgRate: '',
  avgProductPrice: '',
  tradeCommission: '',
  yearlyRate: '',
};

const RetailAndDistributorAchievementForm = () => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [channelList, getChannelList] = useAxiosGet();
  const [customerNameDDL, setCustomerNameDDL] = useState([]);
  const [salesOrgDDl, setSalesOrgDDl] = useState([]);
  const [loginInfo, setLoginInfo] = useState({});
  const [isDetailsReport, setIsDetailsReport] = useState(false);

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const shippointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);

  useEffect(() => {
    GetSalesOrganizationDDL_api(accId, buId, setSalesOrgDDl);
    getChannelList(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`,
    );
    getUserLoginInfo(accId, buId, userId, setLoading, (resData) => {
      const ratId =
        resData?.empLevelId === 7
          ? +resData?.empTerritoryId
          : +resData?.levelId === 6
          ? +resData?.areaId
          : +resData?.levelId === 5
          ? +resData?.regionId
          : +resData?.empTerritoryId;
      const levelId = +resData?.empLevelId;
      setLoginInfo({ ...resData, ratId, levelId });
      // setLoginInfo(resData);
    });
  }, [accId, buId]);

  // useEffect(() => {

  // }, [loginInfo]);

  const getData = (values) => {
    if (values?.reportType?.value === 5) {
      getNetToCompanyData(values, buId, setRowData, setLoading);
    } else {
      getAchievementReports(values, accId, buId, setRowData, setLoading);
    }
  };

  const ViewDisable = (values) => {
    return (
      !values?.reportType ||
      (values?.reportType?.value === 1 &&
        (!values?.year || !values?.month || !values?.type)) ||
      (values?.reportType?.value === 5 &&
        (!values?.shippointDDL ||
          !values?.customerNameDDL ||
          !values?.tradeCommission))
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values) => {}}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <>
            <Card>
              <ModalProgressBar />
              <CardHeader title="Retail And Distributor Achievement"></CardHeader>
              <CardBody>
                {loading && <Loading />}
                <form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <NewSelect
                          name="reportType"
                          options={reportTypes}
                          value={values?.reportType}
                          label="Report Type"
                          onChange={(valueOption) => {
                            setFieldValue('reportType', valueOption);
                            setRowData([]);
                          }}
                          placeholder="Select Report Type"
                        />
                      </div>
                      {[5].includes(values?.reportType?.value) ? (
                        <>
                          <div className="col-lg-3">
                            <NewSelect
                              name="channel"
                              options={channelList || []}
                              value={values?.channel}
                              label="Distribution Channel"
                              onChange={(valueOption) => {
                                setFieldValue('channel', valueOption);
                                setFieldValue('customer', '');
                              }}
                              placeholder="Select Distribution Channel"
                            />
                          </div>
                          <div className="col-lg-3">
                            <NewSelect
                              name="shippointDDL"
                              options={[
                                { value: 0, label: 'All' },
                                ...shippointDDL,
                              ]}
                              value={values?.shippointDDL}
                              label="Shippoint"
                              onChange={(valueOption) => {
                                setFieldValue('shippointDDL', valueOption);
                              }}
                              placeholder="ShipPoint"
                              errors={errors}
                              touched={touched}
                              isDisabled={!values?.reportType}
                            />
                          </div>

                          <div className="col-lg-3">
                            <NewSelect
                              name="salesOrg"
                              options={salesOrgDDl || []}
                              value={values?.salesOrg}
                              label="Sales Org"
                              onChange={(valueOption) => {
                                setFieldValue('salesOrg', valueOption);
                                setFieldValue('customerNameDDL', '');

                                setCustomerNameDDL([]);
                                getCustomerNameDDL(
                                  accId,
                                  buId,
                                  valueOption?.value,
                                  setCustomerNameDDL,
                                );
                              }}
                              isDisabled={!values?.reportType}
                              placeholder="Sales Org"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <NewSelect
                              name="customerNameDDL"
                              options={customerNameDDL || []}
                              value={values?.customerNameDDL}
                              label="Customer Name"
                              onChange={(valueOption) => {
                                setFieldValue('customerNameDDL', valueOption);
                              }}
                              placeholder="Customer name"
                              errors={errors}
                              touched={touched}
                              isDisabled={
                                !values?.reportType || !values?.salesOrg
                              }
                            />
                          </div>
                          <FromDateToDateForm obj={{ values, setFieldValue }} />
                          <div className="col-lg-3">
                            <InputField
                              name="tradeCommission"
                              value={values?.tradeCommission}
                              label="Trade Commission"
                              type="text"
                              placeholder="Trade Commission"
                            />
                          </div>
                          <div className="col-lg-3">
                            <InputField
                              name="yearlyRate"
                              value={values?.yearlyRate}
                              label="Yearly Rate"
                              type="text"
                              placeholder="Yearly Rate"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          {values?.reportType?.value === 1 && (
                            <>
                              <div className="col-lg-3">
                                <NewSelect
                                  name="type"
                                  options={[
                                    { value: 1, label: 'Retail' },
                                    { value: 2, label: 'Distributor' },
                                  ]}
                                  value={values?.type}
                                  label="Type"
                                  onChange={(valueOption) => {
                                    setFieldValue('type', valueOption);
                                    setRowData([]);
                                  }}
                                  placeholder="Select Type"
                                />
                              </div>

                              <div className="col-lg-3">
                                <NewSelect
                                  name="month"
                                  options={monthDDL}
                                  value={values?.month}
                                  label="Month"
                                  onChange={(valueOption) => {
                                    setFieldValue('month', valueOption);
                                  }}
                                  placeholder="Month"
                                />
                              </div>
                              <div className="col-lg-3">
                                <NewSelect
                                  name="year"
                                  options={YearDDL()}
                                  value={values?.year}
                                  label="Year"
                                  onChange={(valueOption) => {
                                    setFieldValue('year', valueOption);
                                  }}
                                  placeholder="Year"
                                />
                              </div>
                            </>
                          )}

                          {values?.reportType?.value !== 1 && (
                            <>
                              <div className="col-lg-3">
                                <InputField
                                  name="fromDate"
                                  value={values?.fromDate}
                                  label="From Date"
                                  type="date"
                                  onChange={(e) => {
                                    setFieldValue('fromDate', e?.target?.value);
                                    setIsDetailsReport(false);
                                  }}
                                />
                              </div>
                              <div className="col-lg-3">
                                <InputField
                                  name="toDate"
                                  value={values?.toDate}
                                  label="To Date"
                                  type="date"
                                  onChange={(e) => {
                                    setFieldValue('toDate', e?.target?.value);
                                    setIsDetailsReport(false);
                                  }}
                                />
                              </div>
                              {values?.reportType?.value === 6 ? (
                                <div className="col-lg-3">
                                  <NewSelect
                                    name="channel"
                                    options={channelList || []}
                                    value={values?.channel}
                                    label="Channel Name"
                                    onChange={(valueOption) => {
                                      setFieldValue('channel', valueOption);
                                      setIsDetailsReport(false);
                                    }}
                                    placeholder="Channel Name"
                                  />
                                </div>
                              ) : (
                                <>
                                  <div className="col-lg-3">
                                    <InputField
                                      name="avgProductPrice"
                                      value={values?.avgProductPrice}
                                      label="Avg Product Price"
                                      type="number"
                                      placeholder="Avg Product Price"
                                    />
                                  </div>
                                  <div className="col-lg-3">
                                    <InputField
                                      name="allowBgRate"
                                      value={values?.allowBgRate}
                                      label="Allow Bg Rate"
                                      type="number"
                                      placeholder="Allow Bg Rate"
                                    />
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}

                      <div className="col-lg-1 mt-5">
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={() => {
                            if (values?.reportType?.value === 6) {
                              setIsDetailsReport(true);
                            } else {
                              getData(values);
                            }
                          }}
                          disabled={ViewDisable(values)}
                        >
                          View
                        </button>
                      </div>

                      {rowData?.length > 0 && (
                        <div className="col-lg-2 mt-5">
                          <ReactHTMLTableToExcel
                            id="test-table-xls-button-att-reports"
                            className="btn btn-primary"
                            table="table-to-xlsx"
                            filename={`${values?.reportType?.label}`}
                            sheet="Sheet1"
                            buttonText="Export Excel"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {isDetailsReport && values?.reportType?.value === 6 ? (
                    <SalesOfficersKPIReport
                      values={values}
                      selectedBusinessUnit={buId}
                      ratId={loginInfo?.ratId}
                      levelId={loginInfo?.levelId}
                      userId={userId}
                    />
                  ) : null}

                  {[5].includes(values?.reportType?.value) ? (
                    <NetToCompanyTable rowData={rowData} />
                  ) : (
                    <RetailAndDistributorAchievementTable
                      rowData={rowData}
                      values={values}
                    />
                  )}
                </form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default RetailAndDistributorAchievementForm;
