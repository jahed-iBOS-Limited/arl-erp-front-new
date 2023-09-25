import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IForm from "../../_helper/_form";
import InputField from "../../_helper/_inputField";
import Loading from "../../_helper/_loading";
import NewSelect from "../../_helper/_select";
import { _getCurrentMonthYearForInput } from "../../_helper/_todayDate";
import useAxiosGet from "../../_helper/customHooks/useAxiosGet";
import BudgetVarianceReportTable from "./budgetVarianceReportTable";
import CostOfProductionReportTable from "./costOfProductionReportTable";
import MaterialConsumptionTableData from "./materialConsumptionTableData";
import MaterialPriceVarianceTable from "./materialPriceVarianceTable";
const initData = {
  reportType: "",
  monthYear: _getCurrentMonthYearForInput(),
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

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
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
            materialPriceVarianceTableDataLoader) && <Loading />}
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
                      }
                      setFieldValue("reportType", valueOption);
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
                    <div className="col-lg-3">
                      <button
                        style={{ marginTop: "18px" }}
                        type="button"
                        class="btn btn-primary"
                        disabled={!values?.monthYear}
                        onClick={() => {
                          if (
                            [1, 2, 3, 4]?.includes(values?.reportType?.value)
                          ) {
                            getData(values, values?.reportType?.value);
                          }
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
              {console.log(values)}
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
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
