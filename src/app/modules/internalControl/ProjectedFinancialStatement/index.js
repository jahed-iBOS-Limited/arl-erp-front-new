import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../_helper/_form";
import InputField from "../../_helper/_inputField";
import Loading from "../../_helper/_loading";
import NewSelect from "../../_helper/_select";
import useAxiosGet from "../../_helper/customHooks/useAxiosGet";
import TrailBalanceProjected from "./trailBalanceProjected";
import {
  getIncomeStatement_api,
  getProfitCenterDDL,
  manageBalanceData,
} from "./helper";
import { _todayDate } from "../../_helper/_todayDate";
import ProjectedIncomeStatement from "./projectedIncomeStatement";
import ProjectedBalanceReport from "./ProjectedBalanceReport";
import ProjectedCashFlow from "./ProjectedCashFlow";
import ProjectedTrailBalanceMultiColumn from "./ProjectedTrailBalanceMultiColumn";

const initData = {
  reportType: "",
  enterpriseDivision: "",
  subDivision: "",
  businessUnit: "",
  profitCenter: "",
  fromDate: "",
  toDate: "",
  lastPeriodFrom: _todayDate(),
  lastPeriodTo: _todayDate(),
  conversionRate: "",
  incomeReportType: "",
};
export default function ProjectedFinancialStatement() {
  const saveHandler = (values, cb) => {};
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [rowData, getRowData, rowLoading, setRowData] = useAxiosGet();
  const [enterpriseDivisionDDL, getEnterpriseDivisionDDL] = useAxiosGet();
  const [incomeStatement, setIncomeStatement] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buddl, getbuddl, buddlLoader, setbuddl] = useAxiosGet();
  const [profitCenterDDL, setProfitCenterDDL] = useState([]);

  useEffect(() => {
    getEnterpriseDivisionDDL(
      `/hcm/HCMDDL/GetBusinessUnitGroupByAccountDDL?AccountId=${profileData?.accountId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={{}}
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
          {(loading || rowLoading || buddlLoader) && <Loading />}
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
                      { value: 1, label: "Projected Trial Balance" },
                      {
                        value: 5,
                        label: "Projected Trial Balance Multi-Column",
                      },
                      { value: 2, label: "Projected Income Statement" },
                      { value: 3, label: "Projected Balance Sheet" },
                      { value: 4, label: "Projected Cash Flow Statement" },
                    ]}
                    value={values?.reportType}
                    label="Report Type"
                    onChange={(valueOption) => {
                      setRowData([]);
                      setIncomeStatement([]);
                      setFieldValue("reportType", valueOption);
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
                    <div className="col-md-3">
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
                    </div>
                    <div className="col-md-3">
                      <InputField
                        value={values?.date}
                        label="Date"
                        name="date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("date", e.target.value);
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
                          setFieldValue("conversionRate", e.target.value);
                        }}
                        min={0}
                      />
                    </div>
                  </>
                ) : null}

                {[2]?.includes(values?.reportType?.value) ? (
                  <>
                    {/* <div className="col-md-3">
                      <NewSelect
                        name="enterpriseDivision"
                        options={enterpriseDivisionDDL || []}
                        value={values?.enterpriseDivision}
                        label="Enterprise Division"
                        onChange={(valueOption) => {
                          setFieldValue("enterpriseDivision", valueOption);
                          setFieldValue("subDivision", "");
                          setFieldValue("businessUnit", "");
                          setFieldValue("profitCenter", "");
                          setIncomeStatement([]);

                          if (valueOption?.value) {
                            getSubDivisionDDL(
                              `/hcm/HCMDDL/GetBusinessUnitSubGroup?AccountId=${profileData?.accountId}&BusinessUnitGroup=${valueOption?.label}`
                            );
                          }
                        }}
                        placeholder="Enterprise Division"
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        name="subDivision"
                        options={subDivisionDDL || []}
                        value={values?.subDivision}
                        label="Sub Division"
                        onChange={(valueOption) => {
                          setFieldValue("subDivision", valueOption);
                          setFieldValue("businessUnit", "");
                          setFieldValue("profitCenter", "");
                          setIncomeStatement([]);

                          if (valueOption) {
                            getBusinessUnitDDL(
                              `/hcm/HCMDDL/GetBusinessUnitByBusinessUnitGroupDDL?AccountId=${
                                profileData?.accountId
                              }&BusinessUnitGroup=${
                                values?.enterpriseDivision?.value
                              }${
                                valueOption
                                  ? `&SubGroup=${valueOption?.value}`
                                  : ""
                              }`,
                              (data) => {
                                const filteredData = data.filter(
                                  (item) =>
                                    !(item.label === "All" && item.value === 0)
                                );
                                setBusinessUnitDDL(filteredData);
                              }
                            );
                          }
                        }}
                        placeholder="Sub Division"
                        isDisabled={!values?.enterpriseDivision}
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        name="businessUnit"
                        options={businessUnitDDL || []}
                        value={values?.businessUnit}
                        label="Business Unit"
                        onChange={(valueOption) => {
                          setFieldValue("businessUnit", valueOption);
                          setFieldValue("profitCenter", "");
                          setIncomeStatement([]);

                          if (valueOption?.value >= 0) {
                            getProfitCenterDDL(
                              valueOption?.value,
                              (profitCenterDDLData) => {
                                setProfitCenterDDL(profitCenterDDLData);
                                setFieldValue("businessUnit", valueOption);
                                setFieldValue(
                                  "profitCenter",
                                  profitCenterDDLData?.[0] || ""
                                );
                              }
                            );
                          }
                        }}
                        placeholder="Business Unit"
                        isDisabled={!values?.subDivision}
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        isDisabled={
                          values?.businessUnit?.value === 0 ||
                          !values?.businessUnit
                            ? true
                            : false
                        }
                        name="profitCenter"
                        options={profitCenterDDL || []}
                        value={values?.profitCenter}
                        label="Profit Center"
                        onChange={(valueOption) => {
                          setFieldValue("profitCenter", valueOption);
                          setIncomeStatement([]);
                        }}
                        placeholder="Profit Center"
                      />
                    </div> */}
                    <div className="col-md-3">
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
                          setFieldValue("businessUnit", valueOption);
                          setFieldValue("profitCenter", "");
                          setIncomeStatement([]);
                          if (valueOption?.value >= 0) {
                            getProfitCenterDDL(
                              valueOption?.value,
                              (profitCenterDDLData) => {
                                setProfitCenterDDL(profitCenterDDLData);
                                setFieldValue("businessUnit", valueOption);
                                setFieldValue(
                                  "profitCenter",
                                  profitCenterDDLData?.[0] || ""
                                );
                              }
                            );
                          }
                        }}
                        placeholder="Business Unit"
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        isDisabled={
                          values?.businessUnit?.value === 0 ||
                          !values?.businessUnit
                            ? true
                            : false
                        }
                        name="profitCenter"
                        options={profitCenterDDL || []}
                        value={values?.profitCenter}
                        label="Profit Center"
                        onChange={(valueOption) => {
                          setFieldValue("profitCenter", valueOption);
                          setIncomeStatement([]);
                        }}
                        placeholder="Profit Center"
                      />
                    </div>
                  </>
                ) : null}

                {[2]?.includes(values?.reportType?.value) ? (
                  <>
                    <div className="col-md-2">
                      <label>Conversion Rate</label>
                      <InputField
                        value={values?.conversionRate}
                        name="conversionRate"
                        placeholder="Conversion Rate"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("conversionRate", e.target.value);
                        }}
                        min={0}
                      />
                    </div>
                    {/* <div className="col-md-2">
                      <NewSelect
                        name="incomeReportType"
                        options={[
                          { value: 1, label: "Statistical" },
                          { value: 2, label: "GL Based" },
                        ]}
                        value={values?.incomeReportType}
                        label="Type"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("incomeReportType", valueOption);
                            setIncomeStatement([]);
                          } else {
                            setFieldValue("incomeReportType", "");
                          }
                        }}
                        placeholder="Type"
                      />
                    </div> */}
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
                          setFieldValue("businessUnit", valueOption);
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
                          setFieldValue("conversionRate", e.target.value);
                        }}
                        min={0}
                      />
                    </div>
                  </>
                ) : null}

                {[1, 2, 4, 5]?.includes(values?.reportType?.value) ? (
                  <>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.fromDate}
                        label="From Date"
                        name="fromDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("fromDate", e.target.value);
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
                          setFieldValue("toDate", e.target.value);
                          setRowData([]);
                        }}
                      />
                    </div>
                  </>
                ) : null}

                <div style={{ marginTop: "17px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      if ([1]?.includes(values?.reportType?.value)) {
                        getRowData(
                          `/fino/Report/GetTrailBalanceProjected?businessUnitId=${selectedBusinessUnit?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`
                        );
                      }
                      if ([2]?.includes(values?.reportType?.value)) {
                        getIncomeStatement_api(
                          values?.fromDate,
                          values?.toDate,
                          values?.toDate,
                          values?.toDate,
                          values?.businessUnit?.value,
                          0,
                          setIncomeStatement,
                          "all",
                          setLoading,
                          "IncomeStatement",
                          values?.enterpriseDivision?.value,
                          values?.conversionRate,
                          values?.subDivision,
                          values?.reportType?.value,
                          values?.profitCenter?.value,
                        );
                      }
                      if ([3]?.includes(values?.reportType?.value)) {
                        getRowData(
                          `/fino/BalanceSheet/GetBalanceSheetProjected?AccountId=${profileData?.accountId}&BusinessUnitGroup=${values?.enterpriseDivision?.value}&BusinessUnitId=${values?.businessUnit?.value}&AsOnDate=${values?.date}&ConvertionRate=${values?.conversionRate}`,
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
                          `/fino/Report/GetTrailBalanceProjectedMultiColumn?businessUnitId=${selectedBusinessUnit?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`
                        );
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
                    selectedBusinessUnit={selectedBusinessUnit}
                  />
                ) : null}
                {[2]?.includes(values?.reportType?.value) ? (
                  <ProjectedIncomeStatement
                    incomeStatement={incomeStatement}
                    values={values}
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
                    selectedBusinessUnit={selectedBusinessUnit}
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
