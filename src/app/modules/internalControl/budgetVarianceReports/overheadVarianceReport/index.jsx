import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { fromDateFromApiNew } from "../../../_helper/_formDateFromApi";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { getProfitCenterDDL } from "../salesBudgetVarianceReport/helper";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
const initData = {
  gl: "",
  fromDate: "",
  toDate: _todayDate(),
  currentBusinessUnit: "",
  profitCenter: "",
  isForecast: false,
};
export default function OverheadVarianceReport() {
  const { profileData, selectedBusinessUnit, businessUnitList } = useSelector(
    (state) => {
      return state.authData;
    },
    shallowEqual
  );

  const formikRef = useRef(null);

  const [glList, getGlList] = useAxiosGet();
  const [rowData, getRowData, , setRowData] = useAxiosGet();
  const [profitCenterDDL, setProfitCenterDDL] = useState([]);

  const [totals, setTotals] = useState({
    totalBudOH: 0,
    totalAchOH: 0,
    totalTotalVariance: 0,
    totalUnitBudOH: 0,
    totalUnitActOH: 0,
    totalUnitVariance: 0,
  });

  // Calculate the totals when rowData changes
  useEffect(() => {
    const newTotals = rowData?.reduce(
      (accumulator, item) => {
        return {
          totalBudOH: accumulator.totalBudOH + (item?.numBudOH || 0),
          totalAchOH: accumulator.totalAchOH + (item?.numAchOH || 0),
          totalTotalVariance:
            accumulator.totalTotalVariance + (item?.numTotalVariance || 0),
          totalUnitBudOH:
            accumulator.totalUnitBudOH + (item?.numUnitBudOH || 0),
          totalUnitActOH:
            accumulator.totalUnitActOH + (item?.numUnitActOH || 0),
          totalUnitVariance:
            accumulator.totalUnitVariance + (item?.numUnitVariance || 0),
        };
      },
      {
        totalBudOH: 0,
        totalAchOH: 0,
        totalTotalVariance: 0,
        totalUnitBudOH: 0,
        totalUnitActOH: 0,
        totalUnitVariance: 0,
      }
    );

    setTotals(newTotals);
  }, [rowData]);

  useEffect(() => {
    getGlList(
      `/mes/SalesPlanning/GetGeneralLedgers?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&accountGroupId=4`
    );

    fromDateFromApiNew(selectedBusinessUnit?.value, (date) => {
      if (formikRef.current) {
        const apiFormDate = date ? _dateFormatter(date) : "";
        formikRef.current.setValues({
          fromDate: apiFormDate,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb) => {};
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      innerRef={formikRef}
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
        isValid,
        errors,
        touched,
      }) => (
        <>
          {false && <Loading />}
          <IForm
            title="Overhead Variance Report"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div>
                <div className="form-group  global-form row">
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
                        setRowData([]);
                      }}
                      placeholder="Profit Center"
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="gl"
                      options={glList || []}
                      value={values?.gl}
                      label="GL Name"
                      onChange={(valueOption) => {
                        setFieldValue("gl", valueOption);
                        setRowData([]);
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
                        setFieldValue("fromDate", e.target.value);
                        setRowData([]);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.toDate}
                      label="To Date"
                      name="toDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                        setRowData([]);
                      }}
                    />
                  </div>
                  <div className="col-lg-2 mt-4">
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
                  <div style={{ marginTop: "17px" }}>
                    <button
                      disabled={
                        !values?.currentBusinessUnit ||
                        !values?.profitCenter ||
                        !values?.gl?.value ||
                        !values?.fromDate ||
                        !values?.toDate
                      }
                      onClick={() => {
                        getRowData(
                          `/fino/Report/GetOverheadVarianceReport?businessUnitId=${values?.currentBusinessUnit?.value}&intProCenId=${values?.profitCenter?.value}&intGLId=${values?.gl?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&isForecast=${values?.isForecast || false}`
                        );
                      }}
                      className="btn btn-primary"
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div>
                  {rowData?.length > 0 && (
                    <div className="mt-5">
                      <div>
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered bj-table bj-table-landing">
                            <thead>
                              <tr>
                                <th>Transaction Code</th>
                                <th>Transaction Name</th>
                                <th>Budget Overhead</th>
                                <th>Actual Overhead</th>
                                <th>Variance</th>
                                <th>BOH / Unit</th>
                                <th>AOH / Unit</th>
                                <th>Variance / Unit</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowData?.map((item, index) => (
                                <tr key={index}>
                                  <td>{item?.strBusinessTransactionCode}</td>
                                  <td>{item?.strBusinessTransactionName}</td>
                                  <td className="text-right">
                                    {item?.numBudOH?.toFixed()}
                                  </td>
                                  <td className="text-right">
                                    {item?.numAchOH?.toFixed()}
                                  </td>
                                  <td className="text-right">
                                    {item?.numTotalVariance?.toFixed()}
                                  </td>
                                  <td className="text-right">
                                    {item?.numUnitBudOH?.toFixed(2)}
                                  </td>
                                  <td className="text-right">
                                    {item?.numUnitActOH?.toFixed(2)}
                                  </td>
                                  <td className="text-right">
                                    {item?.numUnitVariance?.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                              <tr>
                                <td colSpan={2}>
                                  <strong>Total</strong>
                                </td>
                                <td className="text-right">
                                  {totals?.totalBudOH?.toFixed()}
                                </td>
                                <td className="text-right">
                                  {totals?.totalAchOH?.toFixed()}
                                </td>
                                <td className="text-right">
                                  {totals?.totalTotalVariance?.toFixed()}
                                </td>
                                <td className="text-right">
                                  {totals?.totalUnitBudOH?.toFixed(2)}
                                </td>
                                <td className="text-right">
                                  {totals?.totalUnitActOH?.toFixed(2)}
                                </td>
                                <td className="text-right">
                                  {totals?.totalUnitVariance?.toFixed(2)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
