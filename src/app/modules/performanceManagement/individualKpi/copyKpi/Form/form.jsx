/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { ISelect } from "../../../../_helper/_inputDropDown";
import KpiReportTable from "./reportTable";
import axios from "axios";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import NewSelect from "../../../../_helper/_select";
import { getGridDataForCopyYearAction, getYearDDL } from "../helper";
import KpiYearGrid from "./gridForYear";
import { getYearDDLForCopyKpiYear } from "./../helper";
import { getPmsReportAction } from "../../../_helper/getReportAction";

const validationForEmployee = Yup.object().shape({
  selectedType: Yup.object().shape({
    label: Yup.string().required("Selected Type is required"),
    value: Yup.string().required("Selected Type is required"),
  }),
  employee: Yup.object().shape({
    label: Yup.string().required("Employee is required"),
    value: Yup.string().required("Employee is required"),
  }),
  year: Yup.object().shape({
    label: Yup.string().required("Year is required"),
    value: Yup.string().required("Year is required"),
  }),
  copyEmployee: Yup.object().shape({
    label: Yup.string().required("Employee is required"),
    value: Yup.string().required("Employee is required"),
  }),
  copyYear: Yup.object().shape({
    label: Yup.string().required("Year is required"),
    value: Yup.string().required("Year is required"),
  }),
});
const validationForYear = Yup.object().shape({
  selectedType: Yup.object().shape({
    label: Yup.string().required("Selected Type is required"),
    value: Yup.string().required("Selected Type is required"),
  }),
  year: Yup.object().shape({
    label: Yup.string().required("Year is required"),
    value: Yup.string().required("Year is required"),
  }),
  copyYear: Yup.object().shape({
    label: Yup.string().required("Year is required"),
    value: Yup.string().required("Year is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  empDDL,
  isEdit,
  setSelectedEmp,
  employeeBasicInfo,
  getEmployeeBasicInfo,
  viewRowDto,
  dataSourceDDL,
  frequencyDDL,
  commonYearDDL,
  strategicParticularsGrid,
  getStrategicParticularsGridActionDispatcher,
  frequencyId,
  selectedBusinessUnit,
  getBscPerspectiveDefaultValue,
  id,
  deleteIndividualKPIById,
  accountId,
  profileData,
  getKpiEditedSingleData,
  setGridData,
  gridData,
  report,
  setReport,
}) {
  const [objRowTargetAchivment, setObjRowTargetAchivment] = useState({});
  const [allValue, setAllValue] = useState(0);
  const [employeeYearDDLFrom, setEmployeeYearDDLFrom] = useState([]);
  const [employeeYearDDLTo, setEmployeeYearDDLTo] = useState([]);
  const [type, setType] = useState("Employee");
  const [yearDDLForCopyTypeYearTo, setYearDDLForCopyTypeYearTo] = useState([]);
  const [yearDDLForCopyTypeYearFrom, setYearDDLForCopyTypeYearFrom] = useState(
    []
  );

  const loadEmployeeList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/pms/CopyKpi/GetKpiEployeeDDL?accountId=${profileData?.accountId}&businessUnitId=${0}&search=${v}`
      )
      .then((res) => {
        return res?.data;
      });
  };

  useEffect(() => {
    const size = strategicParticularsGrid?.length;
    const key = frequencyId === 2 ? "monthId" : "quarterId";
    if (size) {
      const tempObj = {};
      strategicParticularsGrid.forEach((itm, idx) => {
        tempObj[idx] = { ...itm, [key]: itm.id };
      });
      setObjRowTargetAchivment(tempObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategicParticularsGrid]);

  useEffect(() => {
    const size = strategicParticularsGrid?.length;
    if (size) {
      setObjRowTargetAchivment(
        Object.fromEntries(
          Array.from({ length: size }, (_, i) => [
            i,
            {
              ...objRowTargetAchivment[i],
              target: +allValue,
              actualEndDate: "2020-09-27T12:37:16.694Z",
            },
          ])
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allValue]);

  useEffect(() => {
    getYearDDLForCopyKpiYear(
      selectedBusinessUnit?.value,
      setYearDDLForCopyTypeYearFrom
    );
  }, [selectedBusinessUnit]);

  const filteredYear = (value, values) => {
    if (values?.selectedType?.value === 1) {
      if (values?.employee?.value === values?.copyEmployee?.value) {
        const newData = commonYearDDL.filter((item) => item?.value > value);
        setEmployeeYearDDLTo(newData);
      } else {
        const newData = commonYearDDL.filter((item) => item?.value >= value);
        setEmployeeYearDDLTo(newData);
      }
    } else {
      const newData = commonYearDDL.filter((item) => item?.value > value);
      setYearDDLForCopyTypeYearTo(newData);
    }
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          selectedType: { value: 1, label: "Employee" },
        }}
        validationSchema={
          type === "Employee" ? validationForEmployee : validationForYear
        }
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, gridData, () => {
            // resetForm(initData);
            setGridData([]);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
          setValues,
        }) => (
          <>
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
              {/* Set Kpi */}
              <div className="form-group row">
                <>
                  <div className="col-lg-3">
                    <NewSelect
                      name="selectedType"
                      options={[
                        { value: 1, label: "Employee" },
                        { value: 2, label: "Year" },
                      ]}
                      value={values?.selectedType}
                      onChange={(valueOption) => {
                        setFieldValue("employee", "");
                        setFieldValue("year", "");
                        setFieldValue("copyEmployee", "");
                        setFieldValue("copyYear", "");
                        setFieldValue("selectedType", valueOption);
                        setType(valueOption?.label);
                      }}
                      placeholder="Copy Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-9"></div>
                  {values?.selectedType?.value === 1 && (
                    <div className=" col-lg-6 row">
                      <div className="col-lg-9 mt-3">
                        <b>Copy From :</b>
                      </div>
                      <div className="col-lg-5">
                        <label>Employee</label>
                        <SearchAsyncSelect
                          selectedValue={values?.employee}
                          loadOptions={loadEmployeeList}
                          handleChange={(valueOption) => {
                            setFieldValue("year", "");
                            setFieldValue("copyYear", "");
                            setFieldValue("employee", valueOption);
                            getYearDDL(
                              valueOption?.value,
                              setEmployeeYearDDLFrom
                            );
                          }}
                        />
                      </div>
                      <div className="col-lg-5">
                        <ISelect
                          label="Year"
                          options={employeeYearDDLFrom}
                          name="year"
                          errors={errors}
                          touched={touched}
                          value={values?.year}
                          onChange={(valueOption) => {
                            setFieldValue("copyYear", "");
                            setFieldValue("year", valueOption);
                            if (values?.copyEmployee?.value) {
                              filteredYear(valueOption?.value, values);
                            }
                          }}
                          isDisabled={!values?.employee}
                          placeholder="Year"
                        />
                      </div>
                      <div className="col-lg-1">
                        <button
                          type="button"
                          className="btn btn-primary mt-6"
                          onClick={() => {
                            getPmsReportAction(
                              setReport,
                              selectedBusinessUnit?.value,
                              values?.employee?.value,
                              values?.year?.value,
                              0,
                              0,
                              false,
                              1
                            );
                          }}
                          disabled={
                            !values?.employee ||
                            !values?.year ||
                            !values?.selectedType
                          }
                        >
                          Show
                        </button>
                      </div>
                    </div>
                  )}

                  {values?.selectedType?.value === 1 && (
                    <div className="col-lg-6 row ml-6">
                      <div className="col-lg-9 mt-3">
                        <b>Copy To :</b>
                      </div>
                      {/* <div className="col-lg-5">
                        <NewSelect
                          name="copyEmployee"
                          options={empDDL}
                          value={values?.copyEmployee}
                          label="Employee"
                          onChange={(valueOption) => {
                            setFieldValue("copyYear", "");
                            setFieldValue("copyEmployee", valueOption);
                            if (values?.year?.value) {
                              filteredYear(values?.year?.value, {
                                ...values,
                                copyEmployee: valueOption,
                              });
                            }
                          }}
                          placeholder="Employee"
                          errors={errors}
                          touched={touched}
                        />
                      </div> */}
                       <div className="col-lg-5">
                        <label>Employee</label>
                        <SearchAsyncSelect
                          name="copyEmployee"
                          selectedValue={values?.copyEmployee}
                          loadOptions={loadEmployeeList}
                          handleChange={(valueOption) => {
                            setFieldValue("copyYear", "");
                            setFieldValue("copyEmployee", valueOption);
                            if (values?.year?.value) {
                              filteredYear(values?.year?.value, {
                                ...values,
                                copyEmployee: valueOption,
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="col-lg-5">
                        <NewSelect
                          name="copyYear"
                          options={employeeYearDDLTo}
                          value={values?.copyYear}
                          label="Year"
                          onChange={(valueOption) => {
                            setFieldValue("copyYear", valueOption);
                          }}
                          min={values?.year}
                          placeholder="Year"
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.year}
                        />
                      </div>
                    </div>
                  )}
                  {values?.selectedType?.value === 2 && (
                    <div className=" col-lg-6 row">
                      <div className="col-lg-9 mt-3">
                        <b>Copy From :</b>
                      </div>

                      <div className="col-lg-5">
                        <ISelect
                          label="Year"
                          options={yearDDLForCopyTypeYearFrom}
                          name="year"
                          errors={errors}
                          touched={touched}
                          value={values?.year}
                          onChange={(valueOption) => {
                            setFieldValue("copyYear", "");
                            setFieldValue("year", valueOption);
                            filteredYear(valueOption?.value);
                          }}
                          placeholder="Year"
                        />
                      </div>
                      <div className="col-lg-1">
                        <button
                          type="button"
                          className="btn btn-primary mt-6"
                          onClick={() => {
                            getGridDataForCopyYearAction(
                              values?.year?.value,
                              selectedBusinessUnit?.value,
                              setGridData
                            );
                          }}
                          disabled={!values?.year || !values?.selectedType}
                        >
                          Show
                        </button>
                      </div>
                    </div>
                  )}
                  {values?.selectedType?.value === 2 && (
                    <div className="col-lg-6 row ml-6">
                      <div className="col-lg-9 mt-3">
                        <b>Copy To :</b>
                      </div>
                      <div className="col-lg-5">
                        <NewSelect
                          name="copyYear"
                          options={yearDDLForCopyTypeYearTo}
                          value={values?.copyYear}
                          label="Year"
                          onChange={(valueOption) => {
                            setFieldValue("copyYear", valueOption);
                          }}
                          isDisabled={!values?.year}
                          min={values?.year}
                          placeholder="Year"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                  )}
                </>
              </div>

              <div>
                {values?.selectedType?.value === 2 && (
                  <KpiYearGrid setGridData={setGridData} gridData={gridData} />
                )}
              </div>
              {values?.selectedType?.value === 1 && (
                <KpiReportTable
                  deleteIndividualKPIById={deleteIndividualKPIById}
                  values={values}
                  report={report}
                />
              )}

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => {
                  resetForm(initData);
                  setType("");
                }}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
