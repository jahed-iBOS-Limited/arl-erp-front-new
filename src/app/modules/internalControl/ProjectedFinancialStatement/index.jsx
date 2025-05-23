import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { _firstDateOfCurrentFiscalYear } from '../../_helper/_firstDateOfCurrentFiscalYear';
import IForm from '../../_helper/_form';
import InputField from '../../_helper/_inputField';
import Loading from '../../_helper/_loading';
import { _monthLastDate } from '../../_helper/_monthLastDate';
import NewSelect from '../../_helper/_select';
import useAxiosGet from '../../_helper/customHooks/useAxiosGet';
import ProjectedBalanceReport from './ProjectedBalanceReport';
import ProjectedCashFlow from './ProjectedCashFlow';
import ProjectedFinancialRations from './ProjectedFinancialRations';
import ProjectedPlannedAssetSchedule from './ProjectedPlannedAssetSchedule';
import ProjectedPlannedFundRequirement from './ProjectedPlannedFundRequirement';
import ProjectedTrailBalanceMultiColumn from './ProjectedTrailBalanceMultiColumn';
import {
  getIncomeStatement_api,
  getProfitCenterDDL,
  getReportId,
  groupId,
  manageBalanceData,
  parameterValues,
} from './helper';
import ProjectedIncomeStatement from './projectedIncomeStatement';
import TrailBalanceProjected from './trailBalanceProjected';
import ProjectedCashflowStatementIndirect from './ProjectedCashflowStatementIndirect';
import { getBusinessDDLByED } from '../budgetVarianceReports/incomeStatement/helper';
import DivisionSubDivisionAndBusinessUnit from './commonDivSubDivToBuN';
import PowerBIReport from '../../_helper/commonInputFieldsGroups/PowerBIReport';
import { _lastDateOfMonthPreviousYear } from '../../_helper/_todayDate';

const initData = {
  reportType: '',
  enterpriseDivision: '',
  subDivision: '',
  businessUnit: '',
  profitCenter: '',
  fromDate: _firstDateOfCurrentFiscalYear(),
  toDate: _monthLastDate(),
  conversionRate: 1,
  date: _monthLastDate(),
  viewType: '',
  productDivision: '',
  tradeType: '',
  reportTypeCashFlowIndirect: { value: 0, label: 'All' },
};
export default function ProjectedFinancialStatement() {
  const [buDDL, getBuDDL, buDDLloader, setBuDDL] = useAxiosGet();
  const [showReport, setShowReport] = useState(false);
  const saveHandler = (values, cb) => {};
  const [show, setShow] = useState(false);

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [rowData, getRowData, rowLoading, setRowData] = useAxiosGet();
  const [enterpriseDivisionDDL, getEnterpriseDivisionDDL] = useAxiosGet();
  const [incomeStatement, setIncomeStatement] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buddl, getbuddl, buddlLoader, setbuddl] = useAxiosGet();
  const [
    subDivisionDDL,
    getSubDivisionDDL,
    loadingOnSubDivisionDDL,
    setSubDivisionDDL,
  ] = useAxiosGet();

  const [
    businessUnitBySubDivisionDDL,
    getBusinessUnitBySubDivisionDDL,
    loadingOnBusinessUnitBySubDivisionDDL,
  ] = useAxiosGet();

  const [fiscalYearDDL, getFiscalYearDDL, loadingOnFiscalYearDDL] =
    useAxiosGet();

  const [profitCenterDDL, setProfitCenterDDL] = useState([]);
  const [ratioTableState, setRatioTableState] = useState([]);
  const [componentTableState, setComponentTableState] = useState([]);
  const [
    ,
    getFinancialRatioTable,
    financialRatioTableLoader,
    setFinancialRatioTable,
  ] = useAxiosGet();

  const [
    ,
    getFinancialRatioComponentTable,
    financialRatioComponentTableLoader,
    setFinancialRatioComponentTable,
  ] = useAxiosGet();

  const [
    ,
    getFinancialRatioTableForLastPeriod,
    financialRatioTableForLastPeriodLoader,
  ] = useAxiosGet();

  const [
    ,
    getFinancialRatioComponentTableForLastPeriod,
    financialRatioComponentTableForLastPeriodLoader,
  ] = useAxiosGet();

  const [tradeAndDivisionDDL, getTradeAndDivisionDDL, , ,] = useAxiosGet();

  useEffect(() => {
    getEnterpriseDivisionDDL(
      `/hcm/HCMDDL/GetBusinessUnitGroupByAccountDDL?AccountId=${profileData?.accountId}`
    );
  }, [profileData]);

  useEffect(() => {
    getBuDDL(
      `/domain/OrganizationalUnitUserPermission/GetBusinessUnitPermissionbyUser?UserId=${profileData?.userId}&ClientId=${profileData?.accountId}`,
      (data) => {
        const newData = data?.map((item) => {
          return {
            value: item?.organizationUnitReffId,
            label: item?.organizationUnitReffName,
          };
        });
        setBuDDL(newData);
      }
    );
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        setValues,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(loading ||
            rowLoading ||
            buddlLoader ||
            financialRatioTableLoader ||
            financialRatioComponentTableLoader ||
            buDDLloader ||
            financialRatioTableForLastPeriodLoader ||
            financialRatioComponentTableForLastPeriodLoader ||
            loadingOnSubDivisionDDL ||
            loadingOnBusinessUnitBySubDivisionDDL ||
            loadingOnFiscalYearDDL) && <Loading />}
          <IForm
            title="Projected Financial Statement"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div className="row global-form">
                <div className="col-md-3">
                  <NewSelect
                    name="reportType"
                    options={[
                      { value: 1, label: 'Projected Trial Balance' },
                      {
                        value: 5,
                        label: 'Projected Trial Balance Multi-Column',
                      },
                      { value: 2, label: 'Projected Income Statement' },
                      { value: 3, label: 'Projected Balance Sheet' },
                      { value: 4, label: 'Projected Cash Flow Statement' },
                      { value: 9, label: 'Projected Cash Flow Indirect' },
                      { value: 6, label: 'Projected Financial Ratios' },
                      { value: 7, label: 'Projected Planned Asset Schedule' },
                      { value: 8, label: 'Projected Planned Fund Requirement' },
                    ]}
                    value={values?.reportType}
                    label="Report Type"
                    onChange={(valueOption) => {
                      setRowData([]);
                      setIncomeStatement([]);
                      setShow(false);
                      setFieldValue('reportType', valueOption);
                      setValues({
                        ...initData,
                        reportType: valueOption,
                      });
                    }}
                    placeholder="Report Type"
                  />
                </div>

                {[3]?.includes(values?.reportType?.value) ? (
                  <>
                    <DivisionSubDivisionAndBusinessUnit
                      values={values}
                      setFieldValue={setFieldValue}
                      setSubDivisionDDL={setSubDivisionDDL}
                      setbuddl={setbuddl}
                      getSubDivisionDDL={getSubDivisionDDL}
                      subDivisionDDL={subDivisionDDL}
                      getBusinessDDLByED={getBusinessDDLByED}
                      enterpriseDivisionDDL={enterpriseDivisionDDL}
                      profileData={profileData}
                      buddl={buddl}
                    />
                    {/* <div className="col-md-3">
                      <NewSelect
                        name="enterpriseDivision"
                        options={enterpriseDivisionDDL || []}
                        value={values?.enterpriseDivision}
                        label="Enterprise Division"
                        onChange={(valueOption) => {
                          setFieldValue("enterpriseDivision", valueOption);
                          getbuddl(
                            `/hcm/HCMDDL/GetBusinessUnitByBusinessUnitGroupDDL?AccountId=${profileData?.accountId}&BusinessUnitGroup=${valueOption?.label}`,
                            (resData) => {
                              const filteredData = resData.filter(
                                (item) =>
                                  !(item.label === "All" && item.value === 0)
                              );
                              setbuddl(filteredData);
                            }
                          );
                        }}
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        name="businessUnit"
                        options={buddl || []}
                        value={values?.businessUnit}
                        label="Business Unit"
                        onChange={(valueOption) => {
                          setFieldValue("businessUnit", valueOption);
                        }}
                        placeholder="Business Unit"
                      />
                    </div> */}
                    <div className="col-md-3">
                      <InputField
                        value={values?.date}
                        label="Date"
                        name="date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue('date', e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-md-2">
                      <label>Conversion Rate</label>
                      <InputField
                        value={values?.conversionRate}
                        name="conversionRate"
                        placeholder="Conversion Rate"
                        type="text"
                        onChange={(e) => {
                          setFieldValue('conversionRate', e.target.value);
                        }}
                        min={0}
                      />
                    </div>
                  </>
                ) : null}

                {[2]?.includes(values?.reportType?.value) ? (
                  <>
                    <DivisionSubDivisionAndBusinessUnit
                      values={values}
                      setFieldValue={setFieldValue}
                      setSubDivisionDDL={setSubDivisionDDL}
                      setbuddl={setbuddl}
                      getSubDivisionDDL={getSubDivisionDDL}
                      subDivisionDDL={subDivisionDDL}
                      getBusinessDDLByED={getBusinessDDLByED}
                      enterpriseDivisionDDL={enterpriseDivisionDDL}
                      profileData={profileData}
                      buddl={buddl}
                    />
                    {/* <div className="col-md-3">
                      <NewSelect
                        name="enterpriseDivision"
                        options={enterpriseDivisionDDL || []}
                        value={values?.enterpriseDivision}
                        label="Enterprise Division"
                        onChange={(valueOption) => {
                          setFieldValue("enterpriseDivision", valueOption);
                          getbuddl(
                            `/hcm/HCMDDL/GetBusinessUnitByBusinessUnitGroupDDL?AccountId=${profileData?.accountId}&BusinessUnitGroup=${valueOption?.label}`,
                            (resData) => {
                              const filteredData = resData.filter(
                                (item) =>
                                  !(item.label === "All" && item.value === 0)
                              );
                              setbuddl(filteredData);
                              console.log("filteredData", filteredData);
                            }
                          );
                        }}
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        name="businessUnit"
                        options={buddl || []}
                        value={values?.businessUnit}
                        label="Business Unit"
                        onChange={(valueOption) => {
                          setTradeAndDivisionDDL([]);
                          setFieldValue("businessUnit", valueOption);
                          setFieldValue("profitCenter", "");
                          setFieldValue("viewType", "");
                          setIncomeStatement([]);
                          if (valueOption?.value >= 0) {
                            setFieldValue("businessUnit", valueOption);
                            // getProfitCenterDDL(
                            //   valueOption?.value,
                            //   (profitCenterDDLData) => {
                            //     setProfitCenterDDL(profitCenterDDLData);
                            //     setFieldValue("businessUnit", valueOption);
                            //     setFieldValue(
                            //       "profitCenter",
                            //       profitCenterDDLData?.[0] || ""
                            //     );
                            //   }
                            // );
                          }
                        }}
                        placeholder="Business Unit"
                      />
                    </div> */}
                    <div className="col-md-3">
                      <NewSelect
                        // isDisabled={
                        //   values?.businessUnit?.value === 0 ||
                        //   !values?.businessUnit ||
                        //   !values?.enterpriseDivision?.value
                        //     ? true
                        //     : false
                        // }
                        name="viewType"
                        options={[
                          { value: 'profitCenter', label: 'Profit Center' },
                          {
                            value: 'unitColumn',
                            label: 'Unit Column',
                          },
                          { value: 'monthColumn', label: 'Month Column' },
                        ]}
                        value={values?.viewType}
                        label="View Type"
                        onChange={(valueOption) => {
                          setFieldValue('viewType', valueOption);
                          setShow(false);
                          if (valueOption?.value === 'profitCenter') {
                            getProfitCenterDDL(
                              values?.businessUnit?.value,
                              (profitCenterDDLData) => {
                                setProfitCenterDDL(profitCenterDDLData);
                                // setFieldValue("businessUnit", valueOption);
                                setFieldValue(
                                  'profitCenter',
                                  profitCenterDDLData?.[0] || ''
                                );
                              }
                            );
                          }
                          if (
                            valueOption?.value &&
                            valueOption?.value !== 'profitCenter'
                          ) {
                            getTradeAndDivisionDDL(
                              `/fino/CostSheet/ProfitCenterDivisionChannelDDL?BUId=${values?.businessUnit?.value}&Type=${valueOption?.value}`
                            );
                          }

                          setIncomeStatement([]);
                        }}
                        placeholder="View Type"
                      />
                    </div>
                    {values?.viewType?.value === 'profitCenter' && (
                      <div className="col-md-3">
                        <NewSelect
                          // isDisabled={
                          //   values?.businessUnit?.value === 0 ||
                          //   !values?.businessUnit
                          //     ? true
                          //     : false
                          // }
                          name="profitCenter"
                          options={profitCenterDDL || []}
                          value={values?.profitCenter}
                          label="Profit Center"
                          onChange={(valueOption) => {
                            setFieldValue('profitCenter', valueOption);
                            setIncomeStatement([]);
                          }}
                          placeholder="Profit Center"
                        />
                      </div>
                    )}
                    {values?.viewType?.value === 'Product Division' && (
                      <div className="col-md-3">
                        <NewSelect
                          // isDisabled={
                          //   values?.businessUnit?.value === 0 ||
                          //   !values?.businessUnit
                          //     ? true
                          //     : false
                          // }
                          name="productDivision"
                          options={tradeAndDivisionDDL || []}
                          value={values?.productDivision}
                          label="Product Division"
                          onChange={(valueOption) => {
                            setFieldValue('productDivision', valueOption);
                            setIncomeStatement([]);
                          }}
                          placeholder="Product Division"
                        />
                      </div>
                    )}
                    {values?.viewType?.value === 'Trade Type' && (
                      <div className="col-md-3">
                        <NewSelect
                          isDisabled={!values?.viewType}
                          name="tradeType"
                          options={tradeAndDivisionDDL || []}
                          value={values?.tradeType}
                          label="Trade Type"
                          onChange={(valueOption) => {
                            setFieldValue('tradeType', valueOption);
                            setIncomeStatement([]);
                          }}
                          placeholder="Product Division"
                        />
                      </div>
                    )}
                    <div className="col-md-2">
                      <label>Conversion Rate</label>
                      <InputField
                        value={values?.conversionRate}
                        name="conversionRate"
                        placeholder="Conversion Rate"
                        type="text"
                        onChange={(e) => {
                          setFieldValue('conversionRate', e.target.value);
                        }}
                        min={0}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.fromDate}
                        label="From Date"
                        name="fromDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue('fromDate', e.target.value);
                          setRowData([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.toDate}
                        label="To Date"
                        min={values?.fromDate}
                        name="toDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue('toDate', e.target.value);
                          setRowData([]);
                        }}
                      />
                    </div>
                  </>
                ) : null}

                {[4]?.includes(values?.reportType?.value) ? (
                  <>
                    <div className="col-md-3">
                      <NewSelect
                        name="enterpriseDivision"
                        options={enterpriseDivisionDDL || []}
                        value={values?.enterpriseDivision}
                        label="Enterprise Division"
                        onChange={(valueOption) => {
                          setFieldValue('enterpriseDivision', valueOption);
                          getbuddl(
                            `/hcm/HCMDDL/GetBusinessUnitByBusinessUnitGroupDDL?AccountId=${profileData?.accountId}&BusinessUnitGroup=${valueOption?.label}`,
                            (resData) => {
                              const filteredData = resData.filter(
                                (item) =>
                                  !(item.label === 'All' && item.value === 0)
                              );
                              setbuddl(filteredData);
                              console.log('filteredData', filteredData);
                            }
                          );
                        }}
                      />
                    </div>

                    <div className="col-md-3">
                      <NewSelect
                        name="businessUnit"
                        options={buddl || []}
                        value={values?.businessUnit}
                        label="Business Unit"
                        onChange={(valueOption) => {
                          setFieldValue('businessUnit', valueOption);
                        }}
                        placeholder="Business Unit"
                      />
                    </div>
                    <div className="col-md-2">
                      <label>Conversion Rate</label>
                      <InputField
                        value={values?.conversionRate}
                        name="conversionRate"
                        placeholder="Conversion Rate"
                        type="text"
                        onChange={(e) => {
                          setFieldValue('conversionRate', e.target.value);
                        }}
                        min={0}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.fromDate}
                        label="From Date"
                        name="fromDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue('fromDate', e.target.value);
                          setRowData([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.toDate}
                        label="To Date"
                        min={values?.fromDate}
                        name="toDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue('toDate', e.target.value);
                          setRowData([]);
                        }}
                      />
                    </div>
                  </>
                ) : null}

                {[9]?.includes(values?.reportType?.value) ? (
                  <>
                    <div className="col-md-3">
                      <NewSelect
                        name="reportTypeCashFlowIndirect"
                        options={[
                          {
                            value: 0,
                            label: 'All',
                          },
                          {
                            value: 1,
                            label: 'Group by Unit',
                          },
                          {
                            value: 2,
                            label: 'Group by Month',
                          },
                        ]}
                        value={values?.reportTypeCashFlowIndirect}
                        label="View Type"
                        onChange={(valueOption) => {
                          setFieldValue(
                            'reportTypeCashFlowIndirect',
                            valueOption
                          );
                        }}
                        placeholder="View Type"
                      />
                    </div>
                    <DivisionSubDivisionAndBusinessUnit
                      values={values}
                      setFieldValue={setFieldValue}
                      setSubDivisionDDL={setSubDivisionDDL}
                      setbuddl={setbuddl}
                      getSubDivisionDDL={getSubDivisionDDL}
                      subDivisionDDL={subDivisionDDL}
                      getBusinessDDLByED={getBusinessDDLByED}
                      enterpriseDivisionDDL={enterpriseDivisionDDL}
                      profileData={profileData}
                      buddl={buddl}
                    />

                    <div className="col-md-3">
                      <label>Conversion Rate</label>
                      <InputField
                        value={values?.conversionRate}
                        name="conversionRate"
                        placeholder="Conversion Rate"
                        type="text"
                        onChange={(e) => {
                          setFieldValue('conversionRate', e.target.value);
                        }}
                        min={0}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.fromDate}
                        label="From Date"
                        name="fromDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue('fromDate', e.target.value);
                          setRowData([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.toDate}
                        label="To Date"
                        min={values?.fromDate}
                        name="toDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue('toDate', e.target.value);
                          setRowData([]);
                        }}
                      />
                    </div>
                  </>
                ) : null}

                {[1, 5, 6]?.includes(values?.reportType?.value) ? (
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="businessUnit"
                        options={buDDL || []}
                        value={values?.businessUnit}
                        label="Business Unit"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setRatioTableState([]);
                            setComponentTableState([]);
                            setFieldValue('businessUnit', valueOption);
                          } else {
                            setRatioTableState([]);
                            setComponentTableState([]);
                            setFieldValue('businessUnit', '');
                          }
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.fromDate}
                        label="From Date"
                        name="fromDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue('fromDate', e.target.value);
                          setRowData([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.toDate}
                        label="To Date"
                        min={values?.fromDate}
                        name="toDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue('toDate', e.target.value);
                          setRowData([]);
                        }}
                      />
                    </div>
                  </>
                ) : null}

                {[7]?.includes(values?.reportType?.value) ? (
                  <>
                    <div className="col-md-3">
                      <NewSelect
                        name="enterpriseDivision"
                        options={enterpriseDivisionDDL || []}
                        value={values?.enterpriseDivision}
                        label="Enterprise Division"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue('enterpriseDivision', valueOption);
                            setFieldValue('subDivision', '');
                            setFieldValue('subDivisionBusinessUnit', '');
                            getSubDivisionDDL(
                              `/hcm/HCMDDL/GetBusinessUnitSubGroup?AccountId=1&BusinessUnitGroup=${valueOption?.label}`
                            );
                          } else {
                            setFieldValue('enterpriseDivision', '');
                            setFieldValue('subDivision', '');
                            setFieldValue('subDivisionBusinessUnit', '');
                          }
                        }}
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        name="subDivision"
                        options={subDivisionDDL || []}
                        value={values?.subDivision}
                        label="Sub Division"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue('subDivision', valueOption);
                            getBusinessUnitBySubDivisionDDL(`/hcm/HCMDDL/GetBusinessUnitByBusinessUnitGroupDDL?AccountId=${profileData?.accountId}&BusinessUnitGroup=${values?.enterpriseDivision?.value}&SubGroup=${valueOption?.value}
                          `);
                          } else {
                            setFieldValue('subDivision', '');
                            setFieldValue('subDivisionBusinessUnit', '');
                          }
                        }}
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        name="subDivisionBusinessUnit"
                        options={businessUnitBySubDivisionDDL || []}
                        value={values?.subDivisionBusinessUnit}
                        label="Business Unit"
                        onChange={(valueOption) => {
                          setFieldValue('subDivisionBusinessUnit', valueOption);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.fromDate}
                        label="From Date"
                        name="fromDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue('fromDate', e.target.value);
                          setRowData([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.toDate}
                        label="To Date"
                        min={values?.fromDate}
                        name="toDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue('toDate', e.target.value);
                          setRowData([]);
                        }}
                      />
                    </div>
                  </>
                ) : null}

                {[8]?.includes(values?.reportType?.value) ? (
                  <>
                    <div className="col-md-3">
                      <NewSelect
                        name="enterpriseDivision"
                        options={enterpriseDivisionDDL || []}
                        value={values?.enterpriseDivision}
                        label="Enterprise Division"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setRowData([]);
                            setFieldValue('enterpriseDivision', valueOption);
                            setFieldValue('subDivision', '');
                            setFieldValue('subDivisionBusinessUnit', '');
                            getFiscalYearDDL(`/vat/TaxDDL/FiscalYearDDL`);
                            getSubDivisionDDL(
                              `/hcm/HCMDDL/GetBusinessUnitSubGroup?AccountId=1&BusinessUnitGroup=${valueOption?.label}`
                            );
                          } else {
                            setRowData([]);
                            setFieldValue('enterpriseDivision', '');
                            setFieldValue('subDivision', '');
                            setFieldValue('subDivisionBusinessUnit', '');
                          }
                        }}
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        name="subDivision"
                        options={subDivisionDDL || []}
                        value={values?.subDivision}
                        label="Sub Division"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setRowData([]);
                            setFieldValue('subDivision', valueOption);
                            setFieldValue('subDivisionBusinessUnit', '');
                            getBusinessUnitBySubDivisionDDL(`/hcm/HCMDDL/GetBusinessUnitByBusinessUnitGroupDDL?AccountId=${profileData?.accountId}&BusinessUnitGroup=${values?.enterpriseDivision?.value}&SubGroup=${valueOption?.value}
                          `);
                          } else {
                            setRowData([]);
                            setFieldValue('subDivision', '');
                            setFieldValue('subDivisionBusinessUnit', '');
                          }
                        }}
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        name="subDivisionBusinessUnit"
                        options={businessUnitBySubDivisionDDL || []}
                        value={values?.subDivisionBusinessUnit}
                        label="Business Unit"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue(
                              'subDivisionBusinessUnit',
                              valueOption
                            );
                            setRowData([]);
                          } else {
                            setFieldValue('subDivisionBusinessUnit', '');
                            setRowData([]);
                          }
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="year"
                        options={fiscalYearDDL || []}
                        value={values?.year}
                        label="Year"
                        onChange={(valueOption) => {
                          setFieldValue('year', valueOption);
                        }}
                      />
                    </div>
                  </>
                ) : null}
                {[2, 3, 9, 6]?.includes(values?.reportType?.value) ? (
                  <>
                    <div className="col-md-3">
                      <NewSelect
                        name="isForecast"
                        options={[
                          {
                            value: 0,
                            label: 'Budget',
                          },
                          {
                            value: 1,
                            label: 'Forecast',
                          },
                        ]}
                        value={values?.isForecast}
                        label="Budget/Forecast"
                        onChange={(valueOption) => {
                          setFieldValue('isForecast', valueOption);
                        }}
                        placeholder="Budget/Forecast"
                      />
                    </div>
                  </>
                ) : null}
                <div style={{ marginTop: '17px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if ([1]?.includes(values?.reportType?.value)) {
                        getRowData(
                          `/fino/Report/GetTrailBalanceProjected?businessUnitId=${values?.businessUnit?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`
                        );
                      }
                      if ([2]?.includes(values?.reportType?.value)) {
                        if (values?.viewType?.value === 'profitCenter') {
                          getIncomeStatement_api(
                            values?.isForecast?.value,
                            values?.fromDate,
                            values?.toDate,
                            _lastDateOfMonthPreviousYear(values?.fromDate),
                            _lastDateOfMonthPreviousYear(values?.toDate),
                            values?.businessUnit?.value,
                            0,
                            setIncomeStatement,
                            'all',
                            setLoading,
                            'IncomeStatement',
                            values?.enterpriseDivision?.value,
                            values?.conversionRate,
                            values?.subDivision,
                            values?.reportType?.value,
                            values?.profitCenter?.value,
                            values?.viewType?.value,
                            values?.productDivision?.value
                              ? values?.productDivision?.value
                              : values?.profitCenter?.value
                                ? values?.profitCenter?.label
                                : values?.tradeType?.value,
                            values?.subDivision?.label
                          );
                        } else {
                          setShow(true);
                        }
                      }
                      if ([3]?.includes(values?.reportType?.value)) {
                        getRowData(
                          `/fino/BalanceSheet/GetBalanceSheetProjected?AccountId=${
                            profileData?.accountId
                          }&BusinessUnitGroup=${
                            values?.enterpriseDivision?.value
                          }&BusinessUnitId=${
                            values?.businessUnit?.value
                          }&SubGroup=${
                            values?.subDivision?.label || ''
                          }&AsOnDate=${values?.date}&ConvertionRate=${
                            values?.conversionRate
                          }&isForecast=${values?.isForecast?.value}`,
                          (data) => {
                            setRowData(manageBalanceData(data));
                          }
                        );
                      }
                      if ([4]?.includes(values?.reportType?.value)) {
                        getRowData(
                          `/fino/Report/GetCashFlowStatementProjected?BusinessUnitGroup=${values?.enterpriseDivision?.value}&businessUnitId=${values?.businessUnit?.value}&sbuId=0&fromDate=${values?.fromDate}&toDate=${values?.toDate}&ConvertionRate=${values?.conversionRate}`
                        );
                      }
                      if ([5]?.includes(values?.reportType?.value)) {
                        getRowData(
                          `/fino/Report/GetTrailBalanceProjectedMultiColumn?businessUnitId=${values?.businessUnit?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`
                        );
                      }
                      if ([6]?.includes(values?.reportType?.value)) {
                        const fromDate = values?.fromDate
                          ? new Date(values.fromDate)
                          : new Date();
                        const toDate = values?.toDate
                          ? new Date(values.toDate)
                          : new Date();
                        fromDate.setFullYear(fromDate.getFullYear() - 1);
                        toDate.setFullYear(toDate.getFullYear() - 1);
                        const fromDateStr = fromDate
                          .toISOString()
                          .split('T')[0];
                        const toDateStr = toDate.toISOString().split('T')[0];

                        getFinancialRatioTable(
                          `/fino/BudgetFinancial/GetFinancialRatioProjectd?BusinessUnitId=${values?.businessUnit?.value}&FromDate=${values?.fromDate}&Todate=${values?.toDate}&Type=2&isForecast=${values?.isForecast?.value}`,
                          (financialRatioTableResponse) => {
                            getFinancialRatioTableForLastPeriod(
                              `/fino/CostSheet/GetFinancialRatio?BusinessUnitId=${values?.businessUnit?.value}&FromDate=${fromDateStr}&Todate=${toDateStr}&Type=2&isForecast=${values?.isForecast?.value}`,
                              (financialRatioTableForLastPeriodResponse) => {
                                const lastPeriodMap = new Map();
                                for (const item of financialRatioTableForLastPeriodResponse) {
                                  lastPeriodMap.set(
                                    item.strRarioName,
                                    item.numRatio
                                  );
                                }
                                for (const item of financialRatioTableResponse) {
                                  const lastPeriodValue = lastPeriodMap.get(
                                    item.strRarioName
                                  );
                                  item.lastPeriod =
                                    typeof lastPeriodValue === 'number'
                                      ? lastPeriodValue
                                      : 0;
                                }
                                setFinancialRatioTable([
                                  ...financialRatioTableResponse,
                                ]);
                                setRatioTableState([
                                  ...financialRatioTableResponse,
                                ]);
                              }
                            );
                          }
                        );
                        getFinancialRatioComponentTable(
                          `/fino/BudgetFinancial/GetFinancialRatioProjectd?BusinessUnitId=${values?.businessUnit?.value}&FromDate=${values?.fromDate}&Todate=${values?.toDate}&Type=1&isForecast=${values?.isForecast?.value}`,
                          (finanCialRatioComponentResponse) => {
                            getFinancialRatioComponentTableForLastPeriod(
                              `/fino/CostSheet/GetFinancialRatio?BusinessUnitId=${values?.businessUnit?.value}&FromDate=${fromDateStr}&Todate=${toDateStr}&Type=1&isForecast=${values?.isForecast?.value}`,
                              (
                                financialRatioComponentTableForLastPeriodResponse
                              ) => {
                                const lastPeriodMap = new Map();
                                for (const item of financialRatioComponentTableForLastPeriodResponse) {
                                  lastPeriodMap.set(
                                    item.strComName,
                                    item.numAmount
                                  );
                                }
                                for (const item of finanCialRatioComponentResponse) {
                                  const lastPeriodValue = lastPeriodMap.get(
                                    item.strComName
                                  );
                                  item.numLastPeriod =
                                    typeof lastPeriodValue === 'number'
                                      ? lastPeriodValue
                                      : item.numAmount;
                                }

                                setFinancialRatioComponentTable([
                                  ...finanCialRatioComponentResponse,
                                ]);

                                setComponentTableState([
                                  ...finanCialRatioComponentResponse,
                                ]);
                              }
                            );
                          }
                        );
                      }
                      if ([7]?.includes(values?.reportType?.value)) {
                        getRowData(
                          `/fino/Report/GetAssetSchedulePlanned?accountId=${profileData?.accountId}&businessUnitId=${values?.subDivisionBusinessUnit?.value}&dteFromDate=${values?.fromDate}&dteToDate=${values?.toDate}`
                        );
                      }
                      if ([8]?.includes(values?.reportType?.value)) {
                        getRowData(
                          `/fino/Report/GetPlannedFundRequirement?businessUnitId=${values?.subDivisionBusinessUnit?.value}&strYear=${values?.year?.label}&businessUnitGroup=${values?.enterpriseDivision?.value}&subGroup=${values?.subDivision?.value}`
                        );
                      }
                      // if ([9]?.includes(values?.reportType?.value)) {
                      //   getRowData(
                      //     `/fino/Report/GetCashFlowStatementProjected?BusinessUnitGroup=${values?.enterpriseDivision?.value}&businessUnitId=${values?.businessUnit?.value}&sbuId=0&fromDate=${values?.fromDate}&toDate=${values?.toDate}&ConvertionRate=${values?.conversionRate}`
                      //   );
                      // }
                      if ([9]?.includes(values?.reportType?.value)) {
                        setShowReport(false);
                        setTimeout(() => {
                          setShowReport(true);
                        }, 1000);
                        // getRowData(
                        //   `/fino/Report/GetCashFlowStatementProjectedIndirect?BusinessUnitGroup=${
                        //     values?.enterpriseDivision?.value
                        //   }&SubGroup=${values?.subDivision?.label ||
                        //     ""}&businessUnitId=${
                        //     values?.businessUnit?.value
                        //   }&fromDate=${values?.fromDate}&toDate=${
                        //     values?.toDate
                        //   }&ConvertionRate=${values?.conversionRate}&intType=${
                        //     values?.reportTypeCashFlowIndirect?.value
                        //   }`
                        // );
                      }
                    }}
                    className="btn btn-primary"
                  >
                    Show
                  </button>
                </div>
              </div>
              <div>
                {[1]?.includes(values?.reportType?.value) ? (
                  <TrailBalanceProjected
                    rowData={rowData}
                    values={values}
                    selectedBusinessUnit={values?.businessUnit?.label}
                  />
                ) : null}
                {[2]?.includes(values?.reportType?.value) &&
                values?.viewType?.value === 'profitCenter' ? (
                  <ProjectedIncomeStatement
                    incomeStatement={incomeStatement}
                    values={values}
                  />
                ) : [2]?.includes(values?.reportType?.value) && show ? (
                  <PowerBIReport
                    reportId={getReportId(values)}
                    groupId={groupId}
                    parameterValues={parameterValues(values)}
                    parameterPanel={false}
                  />
                ) : null}
                {[3]?.includes(values?.reportType?.value) ? (
                  <ProjectedBalanceReport
                    balanceReportData={rowData}
                    values={values}
                  />
                ) : null}
                {[4]?.includes(values?.reportType?.value) ? (
                  <ProjectedCashFlow
                    rowDto={rowData}
                    values={values}
                    accountName={profileData?.accountName}
                  />
                ) : null}
                {[5]?.includes(values?.reportType?.value) ? (
                  <ProjectedTrailBalanceMultiColumn
                    rowData={rowData}
                    values={values}
                    selectedBusinessUnit={values?.businessUnit?.label}
                  />
                ) : null}
                {[6]?.includes(values?.reportType?.value) ? (
                  <ProjectedFinancialRations
                    ratioTableData={ratioTableState}
                    componentTableData={componentTableState}
                    values={values}
                    selectedBusinessUnit={values?.businessUnit?.label}
                  />
                ) : null}
                {[7]?.includes(values?.reportType?.value) ? (
                  <ProjectedPlannedAssetSchedule
                    rowData={rowData}
                    toDate={values?.toDate}
                  />
                ) : null}
                {[8]?.includes(values?.reportType?.value) ? (
                  <ProjectedPlannedFundRequirement
                    rowData={rowData}
                    values={values}
                  />
                ) : null}

                {[9]?.includes(values?.reportType?.value) ? (
                  <ProjectedCashflowStatementIndirect
                    rowData={rowData}
                    values={values}
                    selectedBusinessUnit={values?.businessUnit?.label}
                    showReport={showReport}
                  />
                ) : null}
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
