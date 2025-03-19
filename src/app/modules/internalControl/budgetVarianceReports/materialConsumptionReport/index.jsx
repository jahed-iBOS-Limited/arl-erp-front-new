import { Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import { _formatMoney } from "../../../_helper/_formatMoney";
import InputField from "../../../_helper/_inputField";

import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import "./style.css";

const initData = {
  monthYear: "",
  currentBusinessUnit: "",
  consumptionType: "",
  isForecast: false,
};

function MaterialConsumptionVarianceReport() {
  const [rowDto, getRowDto, loading, setRowDto] = useAxiosGet();

  const businessUnitList = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Material Consumption Variance Report"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {loading && <Loading />}
                <div className="global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="currentBusinessUnit"
                      options={businessUnitList}
                      value={values?.currentBusinessUnit}
                      label="Business Unit"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("currentBusinessUnit", valueOption);
                          setRowDto([]);
                        } else {
                          setRowDto([]);
                        }
                      }}
                      placeholder="Business Unit"
                      errors={errors}
                      touched={touched}
                      required={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="consumptionType"
                      options={[
                        { value: 1, label: "BOM wise" },
                        { value: 2, label: "Item wise" },
                      ]}
                      value={values?.consumptionType}
                      label="Consumption Type"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("consumptionType", valueOption);
                          setRowDto([]);
                        } else {
                          setRowDto([]);
                          setFieldValue("consumptionType", "");
                        }
                      }}
                      placeholder="Consumption Type"
                      errors={errors}
                      touched={touched}
                      required={true}
                    />
                  </div>
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
                  <div className="col-lg-1 mt-4">
                    <div className="d-flex align-items-center">
                    <p className="pr-1 pt-3">
                      <input
                        type="checkbox"
                        checked={values?.isForecast} 
                      onChange={(e)=>{
                        setFieldValue("isForecast", e.target.checked);
                      }}
                      />
                    </p>
                    <p>
                      <label>Is Forecast</label>
                    </p>
                  </div>
                    </div>
                  <div>
                    <button
                      style={{ marginTop: "18px" }}
                      type="button"
                      class="btn btn-primary"
                      disabled={
                        !values?.monthYear ||
                        !values?.currentBusinessUnit ||
                        !values?.consumptionType.value
                      }
                      onClick={() => {
                        const [year, month] = values?.monthYear
                          .split("-")
                          .map(Number);
                        const startDate = new Date(
                          Date.UTC(year, month - 1, 1)
                        );
                        const endDate = new Date(Date.UTC(year, month, 0));
                        const formattedStartDate = startDate
                          .toISOString()
                          .split("T")[0];
                        const formattedEndDate = endDate
                          .toISOString()
                          .split("T")[0];
                        getRowDto(
                          `/fino/Report/GetRawMaterialConsumptionVarianceReport?intBusinessUnitId=${values?.currentBusinessUnit?.value}&fromDate=${formattedStartDate}&toDate=${formattedEndDate}&ConsumptionTypeId=${values?.consumptionType.value}&isForecast=${values?.isForecast}`,
                          (data) => {
                            let sl = 0;
                            let arr = [];
                            data.forEach((item) => {
                              let obj = {
                                ...item,
                                isShow:
                                  sl === item?.intSectionSl ? false : true,
                              };
                              if (sl !== item?.intSectionSl) {
                                sl = item?.intSectionSl;
                              }
                              arr.push(obj);
                            });
                            setRowDto(arr);
                          }
                        );
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div className="row mt-5">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered bj-table bj-table-landing material-consumption-variance">
                        <thead>
                          <tr>
                            {values?.consumptionType.value === 1 && (
                              <th>FG Item</th>
                            )}
                            {values?.consumptionType.value === 1 && (
                              <th>FG Item Budget[UoM]</th>
                            )}
                            <th>Material Name</th>
                            <th>UOM</th>
                            <th>Budget Consumption per unit</th>
                            <th>Actual Consumption per unit</th>
                            <th>Variance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.length > 0 &&
                            rowDto?.map((item, index) => (
                              <tr key={index}>
                                {item?.isShow ? (
                                  <>
                                    {values?.consumptionType.value === 1 && (
                                      <td rowSpan={item?.intSectionCount}>
                                        {item?.fgItemName}
                                      </td>
                                    )}
                                    {values?.consumptionType.value === 1 && (
                                      <td
                                        className="text-center"
                                        rowSpan={item?.intSectionCount}
                                      >
                                        {item?.fgItemBudgetWithUom}
                                      </td>
                                    )}
                                  </>
                                ) : null}
                                <td
                                  className={
                                    item?.isTotal
                                      ? "text-left bold"
                                      : "text-left"
                                  }
                                >
                                  {item?.materialName}
                                </td>
                                <td>{item?.materialUom}</td>
                                <td
                                  className={
                                    item?.isTotal
                                      ? "text-right bold"
                                      : "text-right"
                                  }
                                >
                                  {_formatMoney(item?.budgetConsumption, 4)}
                                </td>
                                <td
                                  className={
                                    item?.isTotal
                                      ? "text-right bold"
                                      : "text-right"
                                  }
                                >
                                  {_formatMoney(item?.actualConsumption,4)}
                                </td>
                                <td
                                  className={
                                    item?.isTotal
                                      ? "text-right bold"
                                      : "text-right"
                                  }
                                >
                                  {_formatMoney(item?.variance, 4)}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

export default MaterialConsumptionVarianceReport;
