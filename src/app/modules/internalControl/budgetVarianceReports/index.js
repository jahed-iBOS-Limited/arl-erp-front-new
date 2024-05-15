import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IForm from "../../_helper/_form";
import InputField from "../../_helper/_inputField";
import Loading from "../../_helper/_loading";
import NewSelect from "../../_helper/_select";
import {
  _getCurrentMonthYearForInput,
  _todayDate,
} from "../../_helper/_todayDate";
import useAxiosGet from "../../_helper/customHooks/useAxiosGet";
import { SetReportIncomestatementAction } from "../../_helper/reduxForLocalStorage/Actions";
import BudgetVarianceReportTable from "./budgetVarianceReportTable";
import CostOfProductionReportTable from "./costOfProductionReportTable";
import DistributionQtylReportTable from "./distributionQtylReportTable";
import DistributionRateVarianceTable from "./distributionRateVarianceTable";
import {
  getBusinessDDLByED,
  getEnterpriseDivisionDDL,
  getIncomeStatement_api,
  getProfitCenterDDL,
} from "./helper";
import IncomeStatementReportTable from "./incomeStatementReportTable";
import MaterialConsumptionTableData from "./materialConsumptionTableData";
import MaterialPriceVarianceTable from "./materialPriceVarianceTable";
const initData = {
  reportType: "",
  monthYear: _getCurrentMonthYearForInput(),
  distributionChannel: "",
  region: "",
  area: "",
  territory: "",
  enterpriseDivision: "",
  subDivision: "",
  businessUnit: "",
  profitCenter: "",
  fromDate: "",
  todate: "",
  conversionRate: 1,
  incomeStatementReportType: "",
  lastPeriodFrom: _todayDate(),
  lastPeriodTo: _todayDate(),
};
export default function BudgetVarianceReport() {
  const [loading, setLoading] = useState(false);
  const [
    budgetVarianceTableData,
    getBudgetVarianceTableData,
    budgetVarianceTableDataLoader,
    setBudgetVarianceTableData,
  ] = useAxiosGet();

  const [
    costOfProductionTableData,
    getCostProductionTableData,
    costProductionTableDataLoader,
    setcostProductionTableData,
  ] = useAxiosGet();
  const [
    materialConsumptionTableData,
    getMaterialConsumptionTableData,
    materialConsumptionTableDataLoader,
    setMaterialConsumptionTableData,
  ] = useAxiosGet();
  const [
    materialPriceVarianceTableData,
    getMaterialPriceVarianceTableData,
    materialPriceVarianceTableDataLoader,
    setMaterialPriceVarianceTableData,
  ] = useAxiosGet();
  const [
    distributionQtyVarianceTableData,
    getDistributionQtyVarianceTableData,
    distributionQtyVarianceTableDataLoader,
    setDistributionQtyVarianceTableData,
  ] = useAxiosGet();
  const [
    distributionRateVarianceTableData,
    getDistributionRateVarianceTableData,
    distributionRateVarianceTableDataLoader,
    setDistributionRateVarianceTableData,
  ] = useAxiosGet();
  const dispatch = useDispatch();
  const [channelDDL, getChannelDDL, channelDDLloader] = useAxiosGet();
  const [regionDDL, getRegionDDL, regionLoading, setRegionDDL] = useAxiosGet();
  const [areaDDL, getAreaDDL, areaLoading, setAreaDDl] = useAxiosGet();
  const [
    territoryDDL,
    getTerritoryDDL,
    territoryLoading,
    setTerritoryDDL,
  ] = useAxiosGet();
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [profitCenterDDL, setProfitCenterDDL] = useState([]);
  const [enterpriseDivisionDDL, setEnterpriseDivisionDDL] = useState([]);
  const [showRDLC, setShowRDLC] = useState(false);
  const [incomeStatement, setIncomeStatement] = useState([]);
  const [
    subDivisionDDL,
    getSubDivisionDDL,
    loadingOnGetSubDivisionDDL,
  ] = useAxiosGet([]);
  const formikRef = React.useRef(null);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const getData = (values, reportTypeId) => {
    const [year, month] = values?.monthYear.split("-").map(Number);
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0));
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    if (reportTypeId === 1) {
      getBudgetVarianceTableData(
        `/fino/Report/GetProductionVarianceReport?intBusinessUnitId=${selectedBusinessUnit?.value}&fromDate=${formattedStartDate}&toDate=${formattedEndDate}`
      );
    }
    if (reportTypeId === 2) {
      getCostProductionTableData(
        `/fino/Report/GetMachineWiseCostOfProduction?intBusinessUnitId=${selectedBusinessUnit?.value}&fromDate=${formattedStartDate}&toDate=${formattedEndDate}`,
        (data) => {
          let sl = 0;
          let arr = [];
          data.forEach((item) => {
            let obj = {
              ...item,
              isShow: sl === item?.intSectionSl ? false : true,
            };
            if (sl !== item?.intSectionSl) {
              sl = item?.intSectionSl;
            }
            arr.push(obj);
          });
          setcostProductionTableData(arr);
        }
      );
    }
    if (reportTypeId === 3) {
      getMaterialConsumptionTableData(
        `/fino/Report/GetRawMaterialConsumptionVarianceReport?intBusinessUnitId=${
          selectedBusinessUnit?.value
        }&fromDate=${`${values?.monthYear}-01`}&toDate=${`${values?.monthYear}-01`}`,
        (data) => {
          let sl = 0;
          let arr = [];
          data.forEach((item) => {
            let obj = {
              ...item,
              isShow: sl === item?.intSectionSl ? false : true,
            };
            if (sl !== item?.intSectionSl) {
              sl = item?.intSectionSl;
            }
            arr.push(obj);
          });
          setMaterialConsumptionTableData(arr);
        }
      );
    }
    if (reportTypeId === 4) {
      getMaterialPriceVarianceTableData(
        `/fino/Report/GetRawMaterialPriceVarianceReport?intUnitId=${selectedBusinessUnit?.value}&fromDate=${formattedStartDate}&toDate=${formattedEndDate}`
      );
    }
    if (reportTypeId === 5) {
      getDistributionQtyVarianceTableData(
        `/fino/Report/GetDistributionVarianceReport?partName=Quantity&businessUnitId=${selectedBusinessUnit?.value}&distributionId=${values?.distributionChannel?.value}&regionId=${values?.region?.value}&areaId=${values?.area?.value}&territoryId=${values?.territory?.value}&fromDate=${formattedStartDate}&toDate=${formattedEndDate}`
      );
    }
    if (reportTypeId === 6) {
      getDistributionQtyVarianceTableData(
        `/fino/Report/GetDistributionVarianceReport?partName=Rate&businessUnitId=${selectedBusinessUnit?.value}&distributionId=${values?.distributionChannel?.value}&regionId=${values?.region?.value}&areaId=${values?.area?.value}&territoryId=${values?.territory?.value}&fromDate=${formattedStartDate}&toDate=${formattedEndDate}`
      );
    }
  };
  // console.log(getMaterialPriceVarianceTableData);
  const saveHandler = (values, cb) => {};
  const history = useHistory();

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
          {(loading ||
            budgetVarianceTableDataLoader ||
            costProductionTableDataLoader ||
            materialConsumptionTableDataLoader ||
            materialPriceVarianceTableDataLoader ||
            distributionQtyVarianceTableDataLoader ||
            distributionRateVarianceTableDataLoader) && <Loading />}
          <IForm
            title="Budget Variance Report"
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
                      { value: 1, label: "Production Variance Report" },
                      { value: 2, label: "Cost Of Production" },
                      { value: 3, label: "Material Consumption Variance" },
                      { value: 4, label: "Material Price Variance" },
                      { value: 5, label: "Distribution Quantity Variance" },
                      { value: 6, label: "Distribution Rate Variance" },
                      { value: 7, label: "Income Statement Report" },
                    ]}
                    value={values?.reportType}
                    label="Report Type"
                    onChange={(valueOption) => {
                      if (!valueOption?.reportType) {
                        setBudgetVarianceTableData([]);
                        setcostProductionTableData([]);
                        setMaterialConsumptionTableData([]);
                        setMaterialPriceVarianceTableData([]);
                        setDistributionQtyVarianceTableData([]);
                        setDistributionRateVarianceTableData([]);
                      }
                      setFieldValue("reportType", valueOption);
                      console.log(valueOption?.value);
                      if (
                        valueOption?.value === 5 ||
                        valueOption?.value === 6
                      ) {
                        getChannelDDL(
                          `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}`
                        );
                      }
                      if (valueOption?.value === 7) {
                        getEnterpriseDivisionDDL(
                          profileData?.accountId,
                          setEnterpriseDivisionDDL
                        );
                        // fromDateFromApiNew(selectedBusinessUnit?.value, (date) => {
                        //   if (formikRef.current) {
                        //     const apiFormDate = date ? _dateFormatter(date) : "";
                        //     const modifyInitData = initDataFuction(reportIncomestatement);
                        //     formikRef.current.setValues({
                        //       ...modifyInitData,
                        //       fromDate: apiFormDate,
                        //     });
                        //   }
                        // });
                      }
                      setValues({
                        ...initData,
                        reportType: valueOption,
                      });
                    }}
                    placeholder="Report Type"
                  />
                </div>
                {[1, 2, 3, 4]?.includes(values?.reportType?.value) ? (
                  <>
                    <div className="col-lg-3">
                      <label>Month-Year</label>
                      <InputField
                        value={values?.monthYear}
                        name="monthYear"
                        placeholder="From Date"
                        type="month"
                        onChange={(e) => {
                          setFieldValue("monthYear", e?.target?.value);
                        }}
                      />
                    </div>
                  </>
                ) : null}
                {[5, 6]?.includes(values?.reportType?.value) ? (
                  <>
                    <div className="col-lg-2">
                      <NewSelect
                        name="distributionChannel"
                        options={channelDDL || []}
                        value={values?.distributionChannel}
                        label="Distribution Channel"
                        onChange={(valueOption) => {
                          setDistributionQtyVarianceTableData([]);
                          if (valueOption) {
                            setFieldValue("distributionChannel", valueOption);
                            setFieldValue("region", "");
                            setFieldValue("area", "");
                            setFieldValue("territory", "");
                            getRegionDDL(
                              `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${valueOption?.value}`,
                              (res) => {
                                const newDDL = res?.map((item) => ({
                                  ...item,
                                  value: item?.regionId,
                                  label: item?.regionName,
                                }));
                                setRegionDDL(newDDL);
                              }
                            );
                          } else {
                            setFieldValue("distributionChannel", "");
                            setFieldValue("region", "");
                            setFieldValue("area", "");
                            setFieldValue("territory", "");
                            setRegionDDL([]);
                          }
                        }}
                        placeholder="Distribution Channel"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="region"
                        options={regionDDL || []}
                        value={values?.region}
                        label="Region"
                        onChange={(valueOption) => {
                          setDistributionQtyVarianceTableData([]);
                          if (valueOption) {
                            setFieldValue("region", valueOption);
                            setFieldValue("area", "");
                            setFieldValue("territory", "");
                            const regionId = valueOption?.label
                              ? `&regionId=${valueOption?.value}`
                              : "";
                            getAreaDDL(
                              `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${values?.distributionChannel?.value}${regionId}`,
                              (res) => {
                                const newDDL = res?.map((item) => ({
                                  ...item,
                                  value: item?.areaId,
                                  label: item?.areaName,
                                }));
                                setAreaDDl(newDDL);
                              }
                            );
                          } else {
                            setFieldValue("region", "");
                            setFieldValue("area", "");
                            setFieldValue("territory", "");
                            setAreaDDl([]);
                          }
                        }}
                        placeholder="Region"
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.distributionChannel}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="area"
                        options={areaDDL || []}
                        value={values?.area}
                        label="Area"
                        onChange={(valueOption) => {
                          setDistributionQtyVarianceTableData([]);
                          if (valueOption) {
                            setFieldValue("area", valueOption);
                            setFieldValue("territory", "");
                            const areaId = valueOption?.label
                              ? `&areaId=${valueOption?.value}`
                              : "";
                            getTerritoryDDL(
                              `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${values?.distributionChannel?.value}&regionId=${values?.region?.value}${areaId}`,
                              (res) => {
                                const newDDL = res?.map((item) => ({
                                  ...item,
                                  value: item?.territoryId,
                                  label: item?.territoryName,
                                }));
                                setTerritoryDDL(newDDL);
                              }
                            );
                          } else {
                            setFieldValue("area", "");
                            setFieldValue("territory", "");
                            setTerritoryDDL([]);
                          }
                        }}
                        placeholder="Area"
                        isDisabled={!values?.region}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="territory"
                        options={territoryDDL || []}
                        value={values?.territory}
                        label="Territory"
                        onChange={(valueOption) => {
                          setDistributionQtyVarianceTableData([]);
                          if (valueOption) {
                            setFieldValue("territory", valueOption);
                          } else {
                            setFieldValue("territory", "");
                          }
                        }}
                        placeholder="Territory"
                        isDisabled={!values?.area}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>Month-Year</label>
                      <InputField
                        value={values?.monthYear}
                        name="monthYear"
                        placeholder="From Date"
                        type="month"
                        onChange={(e) => {
                          setDistributionQtyVarianceTableData([]);
                          setFieldValue("monthYear", e?.target?.value);
                        }}
                      />
                    </div>
                  </>
                ) : null}

                {[1, 2, 3, 4, 5, 6]?.includes(values?.reportType?.value) ? (
                  <div className="col-lg-3">
                    <button
                      style={{ marginTop: "18px" }}
                      type="button"
                      class="btn btn-primary"
                      disabled={
                        !values?.monthYear ||
                        ((values?.reportType?.value === 5 ||
                          values?.reportType?.value === 6) &&
                          (!values?.distributionChannel ||
                            !values?.region ||
                            !values?.area ||
                            !values?.territory))
                      }
                      onClick={() => {
                        if (
                          [1, 2, 3, 4, 5, 6]?.includes(
                            values?.reportType?.value
                          )
                        ) {
                          getData(values, values?.reportType?.value);
                        }
                      }}
                    >
                      Show
                    </button>
                  </div>
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
                          setFieldValue("enterpriseDivision", valueOption);
                          setFieldValue("subDivision", "");
                          setFieldValue("businessUnit", "");
                          setFieldValue("profitCenter", "");
                          setShowRDLC(false);
                          setIncomeStatement([]);
                          // dispatch(
                          //   SetReportIncomestatementAction({
                          //     ...values,
                          //     enterpriseDivision: valueOption,
                          //     subDivision: "",
                          //     businessUnit: "",
                          //     profitCenter: "",
                          //   })
                          // );
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
                          setShowRDLC(false);
                          setIncomeStatement([]);
                          // dispatch(
                          //   SetReportIncomestatementAction({
                          //     ...values,
                          //     subDivision: valueOption,
                          //     businessUnit: "",
                          //     profitCenter: "",
                          //   })
                          // );

                          if (valueOption) {
                            getBusinessDDLByED(
                              profileData?.accountId,
                              values?.enterpriseDivision?.value,
                              setBusinessUnitDDL,
                              valueOption
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
                          setShowRDLC(false);
                          setIncomeStatement([]);
                          // dispatch(
                          //   SetReportIncomestatementAction({
                          //     ...values,
                          //     businessUnit: valueOption,
                          //     profitCenter: "",
                          //   })
                          // );
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
                                // dispatch(
                                //   SetReportIncomestatementAction({
                                //     ...values,
                                //     businessUnit: valueOption,
                                //     profitCenter:
                                //       profitCenterDDLData?.[0] || "",
                                //   })
                                // );
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
                          setShowRDLC(false);
                          setIncomeStatement([]);
                          // dispatch(
                          //   SetReportIncomestatementAction({
                          //     ...values,
                          //     profitCenter: valueOption,
                          //   })
                          // );
                        }}
                        placeholder="Profit Center"
                      />
                    </div>
                    <div className="col-md-2">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("fromDate", e.target.value);
                          setShowRDLC(false);
                          // dispatch(
                          //   SetReportIncomestatementAction({
                          //     ...values,
                          //     fromDate: e?.target?.value,
                          //   })
                          // );
                        }}
                      />
                    </div>
                    <div className="col-md-2">
                      <label>To date</label>
                      <InputField
                        value={values?.todate}
                        name="todate"
                        placeholder="To date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("todate", e.target.value);
                          setShowRDLC(false);
                          // dispatch(
                          //   SetReportIncomestatementAction({
                          //     ...values,
                          //     todate: e?.target?.value,
                          //   })
                          // );
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
                          setShowRDLC(false);
                          // dispatch(
                          //   SetReportIncomestatementAction({
                          //     ...values,
                          //     conversionRate: e?.target?.value,
                          //   })
                          // );
                        }}
                        min={0}
                      />
                    </div>
                    <div className="col-md-2">
                      <NewSelect
                        name="incomeStatementReportType"
                        options={[
                          { value: 1, label: "Statistical" },
                          { value: 2, label: "GL Based" },
                        ]}
                        value={values?.incomeStatementReportType}
                        label="Type"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue(
                              "incomeStatementReportType",
                              valueOption
                            );
                            setShowRDLC(false);
                            setIncomeStatement([]);
                            // dispatch(
                            //   SetReportIncomestatementAction({
                            //     ...values,
                            //     reportType: valueOption,
                            //   })
                            // );
                          } else {
                            setFieldValue("reportType", "");
                            // dispatch(
                            //   SetReportIncomestatementAction({
                            //     ...values,
                            //     reportType: "",
                            //   })
                            // );
                          }
                        }}
                        placeholder="Report Type"
                      />
                    </div>
                    <div className="col-md-4 mt-5 pt-1 d-flex" style={{
                        flexWrap: "wrap",
                        gap: "5px",
                      }}>
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          setShowRDLC(false);
                          dispatch(
                            SetReportIncomestatementAction({
                              ...values,
                            })
                          );
                          getIncomeStatement_api(
                            values?.fromDate,
                            values?.todate,
                            values?.lastPeriodFrom,
                            values?.lastPeriodTo,
                            values?.businessUnit?.value,
                            0,
                            setIncomeStatement,
                            values?.profitCenter,
                            setLoading,
                            "IncomeStatement",
                            values?.enterpriseDivision?.value,
                            values?.conversionRate,
                            values?.subDivision,
                            values?.reportType?.value
                          );
                        }}
                        disabled={
                          !values?.profitCenter ||
                          !values?.businessUnit ||
                          !values?.enterpriseDivision ||
                          !values?.conversionRate ||
                          values?.conversionRate <= 0 ||
                          !values?.reportType
                        }
                      >
                        Show
                      </button>
                    </div>
                  </>
                ) : null}
              </div>

              <div>
                {[1]?.includes(values?.reportType?.value) &&
                budgetVarianceTableData?.length > 0 ? (
                  <BudgetVarianceReportTable
                    tableData={budgetVarianceTableData}
                  />
                ) : null}
                {[2]?.includes(values?.reportType?.value) &&
                costOfProductionTableData?.length > 0 ? (
                  <CostOfProductionReportTable
                    rowDto={costOfProductionTableData}
                  />
                ) : null}
                {[3]?.includes(values?.reportType?.value) &&
                materialConsumptionTableData?.length > 0 ? (
                  <MaterialConsumptionTableData
                    rowDto={materialConsumptionTableData}
                  />
                ) : null}
                {[4]?.includes(values?.reportType?.value) &&
                materialPriceVarianceTableData?.length > 0 ? (
                  <MaterialPriceVarianceTable
                    rowDto={materialPriceVarianceTableData}
                  />
                ) : null}
                {[5]?.includes(values?.reportType?.value) &&
                distributionQtyVarianceTableData?.length > 0 ? (
                  <DistributionQtylReportTable
                    tableData={distributionQtyVarianceTableData}
                  />
                ) : null}
                {[6]?.includes(values?.reportType?.value) &&
                distributionQtyVarianceTableData?.length > 0 ? (
                  <DistributionRateVarianceTable
                    tableData={distributionQtyVarianceTableData}
                  />
                ) : null}
                {[7]?.includes(values?.reportType?.value) &&
                incomeStatement?.length > 0 ? (
                  <IncomeStatementReportTable
                  incomeStatement={incomeStatement}
                  values ={values}
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
