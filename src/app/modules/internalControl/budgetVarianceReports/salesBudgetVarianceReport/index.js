import { Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import { _formatMoney } from "../../../_helper/_formatMoney";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { getProfitCenterDDL } from "./helper";

const initData = {
  currentBusinessUnit: "",
  profitCenter: "",
  fromDate: "",
  toDate: "",
  isForecast: 0,
};
const BudgetVsSalesVarient = () => {
  const [rowData, getRowData, lodar, setRowData] = useAxiosGet();
  const [profitCenterDDL, setProfitCenterDDL] = useState([]);
  const businessUnitList = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  const getMonth = (monthNumber) => {
    return new Date(2021, monthNumber, 0).toLocaleString("default", {
      month: "long",
    });
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Sales Variance Report"}></CardHeader>
              <CardBody>
                {lodar && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="currentBusinessUnit"
                        options={businessUnitList}
                        value={values?.currentBusinessUnit}
                        label="Business Unit"
                        onChange={(valueOption) => {
                          if (valueOption?.value >= 0) {
                            getProfitCenterDDL(
                              valueOption?.value,
                              (profitCenterDDLData) => {
                                console.log(profitCenterDDLData);
                                setProfitCenterDDL(profitCenterDDLData);
                                setFieldValue(
                                  "profitCenter",
                                  profitCenterDDLData?.[1] || ""
                                );
                              }
                            );
                          }
                          if (valueOption) {
                            setFieldValue("currentBusinessUnit", valueOption);
                            setRowData([]);
                          } else {
                            setFieldValue("currentBusinessUnit", "");
                            setRowData([]);
                          }
                        }}
                        placeholder="Business Unit"
                        errors={errors}
                        touched={touched}
                        required={true}
                      />
                    </div>
                    {console.log(values)}
                    <div className="col-md-3">
                      <NewSelect
                        name="profitCenter"
                        options={profitCenterDDL || []}
                        value={values?.profitCenter}
                        label="Profit Center"
                        onChange={(valueOption) => {
                          setFieldValue("profitCenter", valueOption);
                        }}
                        placeholder="Profit Center"
                      />
                    </div>
                    {/* <div className="col-lg-3">
                      <InputField
                        label="Month & Year"
                        placeholder="Month"
                        name="month"
                        type="month"
                        value={values?.month}
                        onChange={(e) => {
                          setFieldValue(
                            "monthId",
                            +e.target.value
                              .split("")
                              .slice(-2)
                              .join("")
                          );
                          setFieldValue(
                            "yearId",
                            +e.target.value
                              .split("")
                              .slice(0, 4)
                              .join("")
                          );
                          setFieldValue("month", e.target.value);
                          setRowData([]);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div> */}
                    <div className="col-lg-3">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("fromDate", e?.target?.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("toDate", e?.target?.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-1 mt-4">
                    <div className="d-flex align-items-center">
                    <p className="pr-1 pt-3">
                      <input
                        type="checkbox"
                        checked={values?.isForecast === 1} 
                      onChange={(e)=>{
                        setFieldValue("isForecast", e.target.checked ? 1 : 0);
                      }}
                      />
                    </p>
                    <p>
                      <label>Is Forecast</label>
                    </p>
                  </div>
                    </div>
                    <div className="col-lg-3">
                      <button
                        style={{ marginTop: "20px" }}
                        className="btn btn-primary ml-2"
                        disabled={
                          !values?.currentBusinessUnit ||
                          !values?.profitCenter ||
                          !values?.fromDate ||
                          !values?.toDate
                        }
                        onClick={() => {
                          getRowData(
                            `/fino/CostSheet/BudgetVSSalesVarienceReport?Unitid=${values.currentBusinessUnit.value}&FromDate=${values.fromDate}&ToDate=${values.toDate}&ProfitCenterId=${values?.profitCenter?.value}&isForecast=${values?.isForecast}`
                          );
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                </div>
                {rowData?.length > 0 && (
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="text-center">
                        <h2>{values?.currentBusinessUnit?.label}</h2>
                        <h5>
                          Budget vs Sales Variance For{" "}
                          {getMonth(values?.monthId)}-{values?.yearId}
                        </h5>
                      </div>
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                          <thead>
                            <tr>
                              <th rowSpan={2} style={{ width: "30px" }}>
                                SL
                              </th>
                              <th rowSpan={2}>Item Code</th>
                              <th rowSpan={2}>Item Name</th>
                              <th rowSpan={2}>Uom</th>
                              <th colSpan={4}>Volume (MT)</th>
                              <th colSpan={4}>Value (Tk.)</th>
                            </tr>
                            <tr>
                              <th>Budget</th>
                              <th>Actual</th>
                              <th>Variance</th>
                              <th>Variance %</th>
                              <th>Budget</th>
                              <th>Actual</th>
                              <th>Variance</th>
                              <th>Variance %</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowData?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {item?.strItemCode}
                                </td>
                                <td>{item?.strItemName}</td>
                                <td>{item?.strUomName}</td>

                                <td className="text-center">
                                  {_formatMoney(item?.numBudgetQty.toFixed(2))}
                                </td>
                                <td className="text-center">
                                  {_formatMoney(item?.numSalesQty.toFixed(2))}
                                </td>
                                <td className="text-center">
                                  {_formatMoney(item?.varianceQnt.toFixed(2))}
                                </td>
                                <td className="text-center">
                                  {item?.numVarienceQtyPercentate?.toFixed(2)}
                                </td>

                                <td className="text-center">
                                  {_formatMoney(
                                    item?.numBudgetValue.toFixed(2)
                                  )}
                                </td>
                                <td className="text-center">
                                  {_formatMoney(item?.numSalesValue.toFixed(2))}
                                </td>
                                <td className="text-center">
                                  {_formatMoney(
                                    item?.varianceValues.toFixed(2)
                                  )}
                                </td>
                                <td className="text-center">
                                  {item?.numVarienceValuePercentate?.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td colSpan={4} className="text-center bold">
                                Total
                              </td>
                              <td className="text-center bold">
                                {rowData
                                  ?.reduce(
                                    (a, b) => a + (b.numBudgetQty || 0),
                                    0
                                  )
                                  .toFixed(2)}
                              </td>
                              <td className="text-center bold">
                                {rowData
                                  ?.reduce(
                                    (a, b) => a + (b.numSalesQty || 0),
                                    0
                                  )
                                  .toFixed(2)}
                              </td>
                              <td className="text-center bold">
                                {rowData
                                  ?.reduce(
                                    (a, b) => a + (b.varianceQnt || 0),
                                    0
                                  )
                                  .toFixed(2)}
                              </td>
                              <td className="text-center bold">
                                {(
                                  (rowData?.reduce(
                                    (a, b) => a + (b.varianceQnt || 0),
                                    0
                                  ) /
                                    rowData?.reduce(
                                      (a, b) => a + (b.numBudgetQty || 0),
                                      0
                                    )) *
                                  100
                                ).toFixed(2)}
                              </td>

                              <td className="text-center bold">
                                {rowData
                                  ?.reduce(
                                    (a, b) => a + (b.numBudgetValue || 0),
                                    0
                                  )
                                  .toFixed(2)}
                              </td>
                              <td className="text-center bold">
                                {rowData
                                  ?.reduce(
                                    (a, b) => a + (b.numSalesValue || 0),
                                    0
                                  )
                                  .toFixed(2)}
                              </td>
                              <td className="text-center bold">
                                {rowData
                                  ?.reduce(
                                    (a, b) => a + (b.varianceValues || 0),
                                    0
                                  )
                                  .toFixed(2)}
                              </td>
                              <td className="text-center bold">
                                {(
                                  (rowData?.reduce(
                                    (a, b) => a + (b.varianceValues || 0),
                                    0
                                  ) /
                                    rowData?.reduce(
                                      (a, b) => a + (b.numBudgetValue || 0),
                                      0
                                    )) *
                                  100
                                ).toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default BudgetVsSalesVarient;
