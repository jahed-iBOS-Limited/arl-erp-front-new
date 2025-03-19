import React, { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import { useState } from "react";
import { ISelect } from "../../../../_helper/_inputDropDown";
import KpiEntryGrid from "./kpiEntryGrid";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import KpiReportTable from "./reportTable";
import { setIndividualKpi_Action } from "../../../../_helper/reduxForLocalStorage/Actions";
import axios from "axios";
import { toast } from "react-toastify";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import { getPmsReportAction } from "../../../_helper/getReportAction";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { getObjectiveDDLAction } from "../../../_redux/Actions";

const saveKpiTransafer = async (
  pmsId,
  FromEmployeeId,
  ToEmployeeId,
  ActionBy
) => {
  try {
    const res = await axios.post(
      `/pms/Kpi2/TransferTergetKPI?PmsId=${pmsId}&FromEmployeeId=${FromEmployeeId}&ToEmployeeId=${ToEmployeeId}&ActionBy=${ActionBy}`
    );
    if (res.status === 200) {
      toast.success(res?.message || "Transfer Succes");
    }
  } catch (error) {}
};

// Validation schema
const validationSchema = Yup.object().shape({
  employee: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Employee is required"),
  kpiname: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(300, "Maximum 300 symbols")
    .required("Kpi Name is required"),
  bscPerspective: Yup.object().shape({
    label: Yup.string().required("Bscperspective is required"),
    value: Yup.string().required("Bscperspective is required"),
  }),
  kpiformat: Yup.object().shape({
    label: Yup.string().required("Kpi format is required"),
    value: Yup.string().required("Kpi format is required"),
  }),
  weight: Yup.object().shape({
    label: Yup.string().required("Weight is required"),
    value: Yup.string().required("Weight is required"),
  }),
  maxiMini: Yup.object().shape({
    label: Yup.string().required("Field is required"),
    value: Yup.string().required("Field is required"),
  }),
  dataSource: Yup.object().shape({
    label: Yup.string().required("Data Source is required"),
    value: Yup.string().required("Data Source is required"),
  }),

  targetFrequency: Yup.object().shape({
    label: Yup.string().required("Target Frequency is required"),
    value: Yup.string().required("Target Frequency is required"),
  }),
  aggregationType: Yup.object().shape({
    label: Yup.string().required("Aggregation Type is required"),
    value: Yup.string().required("Aggregation Type is required"),
  }),
});

// Validation schema when copy Kpi Type is selected
const copyKPIvalidationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  empDDL,
  isEdit,
  weightDDL,
  bscPerspectiveDDL,
  objectiveDDL,
  yearDDL,
  employeeBasicInfo,
  getEmployeeBasicInfo,
  viewRowDto,
  dataSourceDDL,
  frequencyDDL,
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
  report,
  setReport,
}) {
  const [objRowTargetAchivment, setObjRowTargetAchivment] = useState({});
  const [allValue, setAllValue] = useState(0);
  const dispatch = useDispatch();
  const [employee, setEmployee] = useState("");
  const [year, setYear] = useState("");
  const [isTransfer, setIsTransfer] = useState(false);
  // const [employeeListDDL, setEmployeeListDDL] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [isCopyKPI, setIsCopyKPI] = useState(false);
  const [kpiDDL, getKpiDDL, , setKpiDDL] = useAxiosGet();

  const individualKpi = useSelector((state) => {
    return state.localStorage.individualKpi;
  }, shallowEqual);

  const loadUserList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetLineManagerDDLSearch?AccountId=${profileData?.accountId}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      });
  };

  const kpiDetails = (values) => {
    return [
      {
        label: "Select Objective",
        name: "objective",
        options: objectiveDDL,
        isDisabled: !values.employee?.value,
        dependencyFunc: (currentValue, values, setter) => {
          if (currentValue) {
            getBscPerspectiveDefaultValue(currentValue).then((res) => {
              getKpiDDL(
                `/pms/KPI/GetKPIMasterDataDDL?accountId=${profileData?.accountId}&bscId=${res.data[0]?.value}`
              );
              setter("bscPerspective", res.data[0]);
              setter("kpiname", "");
            });
          }
          if (!currentValue) {
            setter("bscPerspective", "");
            setter("kpiname", "");
            setKpiDDL([]);
          }
        },
      },

      {
        label: "Select BSC Perspective",
        name: "bscPerspective",
        options: bscPerspectiveDDL,
        dependencyFunc: (currentValue, values, setter) => {
          if (currentValue) {
            getKpiDDL(
              `/pms/KPI/GetKPIMasterDataDDL?accountId=${profileData?.accountId}&bscId=${currentValue}`
            );
            setter("kpiname", "");
          }
          if (!currentValue) {
            setter("kpiname", "");
            setKpiDDL([]);
          }
        },
        // value: values.bscPerspective?.value
        //   ? values.bscPerspective
        //   : bscPerspectiveDefaultValue,
      },
      {
        label: "KPI Name",
        name: "kpiname",
        options: kpiDDL || [],
        defaultValue: values.kpiname,
        // isInput: false,
      },
      {
        label: "Select KPI Format",
        name: "kpiformat",
        options: [
          { label: "% of", value: "% of" },
          { label: "# of", value: "# of" },
          {
            label: "Amount",
            value: "BDT",
          },
          {
            label: "Amount ($)",
            value: "$",
          },
        ],
        defaultValue: values.kpiformat,
      },
      {
        label: "Select Weight",
        name: "weight",
        options: weightDDL,
        defaultValue: values.weight,
      },
      {
        label: "Select Data Source",
        name: "dataSource",
        options: dataSourceDDL,
        defaultValue: values.dataSource,
      },
      {
        label: "Select Max/Mini",
        name: "maxiMini",
        options: [
          { label: "Maximization", value: 1 },
          { label: "Minimization", value: 2 },
        ],
        defaultValue: values.maxiMini,
      },
      {
        label: "Select Aggregation Type",
        defaultValue: values.aggregationType,
        name: "aggregationType",
        options: [
          {
            label: "Avarage",
            value: "avarage",
          },
          {
            label: "Sum",
            value: "sum",
          },
        ],
      },
    ];
  };

  // Set and get value in rowdto
  const rowDtoHandler = (name, value, sl) => {
    setObjRowTargetAchivment({
      ...objRowTargetAchivment,
      [sl]: {
        ...objRowTargetAchivment[sl],
        [name]: value,
      },
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
    if (individualKpi?.value && yearDDL[0]?.value) {
      dispatch(
        setIndividualKpi_Action({
          value: individualKpi?.value,
          label: individualKpi?.label,
        })
      );
      if (!id) {
        getPmsReportAction(
          setReport,
          selectedBusinessUnit.value,
          individualKpi?.value,
          yearDDL[0]?.value,
          0,
          0,
          false,
          1
        );
      }
      getEmployeeBasicInfo(individualKpi?.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearDDL]);

  const loadEmployeeList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/pms/CopyKpi/GetKpiEployeeDDL?accountId=${
          profileData?.accountId
        }&businessUnitId=${0}&search=${v}`
      )
      .then((res) => {
        return res?.data;
      });
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          year: { value: yearDDL[0]?.value, label: yearDDL[0]?.label },
          employee: individualKpi?.value ? individualKpi : "",
        }}
        validationSchema={
          isCopyKPI ? copyKPIvalidationSchema : validationSchema
        }
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler({ objValues: values, objRowTargetAchivment }, () => {
            if (values?.employee && (values?.year || year)) {
              getPmsReportAction(
                setReport,
                selectedBusinessUnit?.value,
                values?.employee?.value,
                values?.year?.value || year?.value,
                0,
                0,
                false,
                1
              );
            }
            setAllValue(0);
            setIsCopyKPI(false);
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
                {!id && (
                  <>
                    {/* <div className="col-lg-3">
                      <ISelect
                        value={employee ? employee : values?.employee}
                        label="Select Employee"
                        name="employee"
                        isDisabled={isEdit}
                        options={empDDL}
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        dependencyFunc={(
                          currentValue,
                          allValues,
                          setter,
                          label
                        ) => {
                          dispatch(
                            setIndividualKpi_Action({
                              value: currentValue,
                              label: label,
                            })
                          );
                          // resetForm({
                          //   ...initData,
                          //   year: {
                          //     value: yearDDL[0]?.value,
                          //     label: yearDDL[0]?.label,
                          //   },
                          // });

                          setValues({
                            ...initData,
                            year: {
                              value: yearDDL[0]?.value,
                              label: yearDDL[0]?.label,
                            },
                            selectedType: values?.selectedType,
                            copyEmployee: values?.copyEmployee,
                            copyYear: values?.copyYear,
                          });
                          setter("employee", {
                            value: currentValue,
                            label: label,
                          });

                          getPmsReportAction(
                            setReport,
                            selectedBusinessUnit?.value,
                            currentValue,
                            values?.year?.value || year?.value,
                            0,
                            0,
                            false,
                            1
                          );

                          setEmployee({
                            value: currentValue,
                            label: label,
                          });
                          getEmployeeBasicInfo(currentValue);
                        }}
                      />
                    </div> */}
                    <div className="col-lg-3">
                      <label>Select Employee</label>
                      <SearchAsyncSelect
                        selectedValue={employee ? employee : values?.employee}
                        name="employee"
                        isDisabled={isEdit}
                        loadOptions={loadEmployeeList}
                        handleChange={(valueOption) => {
                          setFieldValue("employee", valueOption);
                          dispatch(
                            setIndividualKpi_Action({
                              value: valueOption?.value,
                              label: valueOption?.label,
                            })
                          );
                          setValues({
                            ...initData,
                            year: {
                              value: yearDDL[0]?.value,
                              label: yearDDL[0]?.label,
                            },
                            selectedType: values?.selectedType,
                            copyEmployee: values?.copyEmployee,
                            copyYear: values?.copyYear,
                          });

                          getPmsReportAction(
                            setReport,
                            selectedBusinessUnit?.value,
                            valueOption?.value,
                            values?.year?.value || year?.value,
                            0,
                            0,
                            false,
                            1
                          );

                          setEmployee({
                            value: valueOption?.value,
                            label: valueOption?.label,
                          });
                          getEmployeeBasicInfo(valueOption?.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <ISelect
                        label="Select Year"
                        options={yearDDL}
                        name="year"
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                        value={year ? year : values?.year}
                        dependencyFunc={(
                          value,
                          allValues,
                          setter,
                          label,
                          selectedValue
                        ) => {
                          setYear(selectedValue);
                          // resetForm({
                          //   ...initData,
                          // });
                          setValues({
                            ...initData,
                            selectedType: values?.selectedType,
                            copyEmployee: values?.copyEmployee,
                            copyYear: values?.copyYear,
                          });
                          setter("year", selectedValue);
                          dispatch(
                            getObjectiveDDLAction(
                              profileData.accountId,
                              selectedBusinessUnit.value,
                              null,
                              1,
                              value
                            )
                          );
                          setter("objective", "");
                          setter("bscPerspective", "");
                          setter("kpiname", "");
                          if (values?.employee?.value) {
                            setter("employee", {
                              value: values?.employee?.value,
                              label: values?.employee?.label,
                            });
                          }
                          if (values?.employee?.value) {
                            getPmsReportAction(
                              setReport,
                              selectedBusinessUnit?.value,
                              values?.employee?.value,
                              value,
                              0,
                              0,
                              false,
                              1
                            );
                          }
                        }}
                        values={values}
                      />
                    </div>
                    <div className="col-lg-3">
                      <IInput value={values?.url} label="URL" name="url" />
                    </div>
                    <div style={{ marginTop: "28px" }} className="col-lg-3">
                      <span className="mr-2">Is Daily Entry?</span>
                      <Field
                        type="checkbox"
                        name="isDailyEntry"
                        checked={values?.isDailyEntry}
                        onChange={(e) =>
                          setFieldValue("isDailyEntry", e.target.checked)
                        }
                      />
                    </div>
                  </>
                )}
                {employeeBasicInfo && (
                  <div
                    style={{ paddingLeft: "1.08em" }}
                    className=" row mt-3 employee_info"
                  >
                    <div className="col-lg-12">
                      {id && (
                        <>
                          <b>Enroll </b>: {employeeBasicInfo?.employeeId},{" "}
                          <b>Employee </b>: {employeeBasicInfo?.employeeName},{" "}
                        </>
                      )}
                      <b> Designation </b>: {employeeBasicInfo?.designationName}
                      , <b> Department </b>: {employeeBasicInfo?.departmentName}
                      , <b> Supervisor </b>: {employeeBasicInfo?.supervisorName}
                      , <b> SBU </b>: {employeeBasicInfo?.sbuName},{" "}
                      <b> Business Unit </b>:{" "}
                      {employeeBasicInfo?.businessUnitName}
                    </div>

                    {id && (
                      <div class="col-lg-6">
                        <div class="row">
                          <div class="col-lg-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                setIsTransfer((trans) => !trans);
                              }}
                              style={{ marginTop: "20px" }}
                              class="btn btn-primary"
                            >
                              {isTransfer ? "Close" : "Transfer"}
                            </button>
                          </div>

                          {isTransfer && (
                            <>
                              <div className="col-lg-7">
                                <label>Employee Name</label>
                                <SearchAsyncSelect
                                  selectedValue={employeeName}
                                  handleChange={(valueOption) => {
                                    setEmployeeName(valueOption);
                                  }}
                                  loadOptions={loadUserList}
                                />
                              </div>
                              <div class="col-lg-3">
                                <button
                                  type="button"
                                  style={{ marginTop: "20px" }}
                                  onClick={() => {
                                    saveKpiTransafer(
                                      id,
                                      employeeBasicInfo?.employeeId,
                                      employeeName.value,
                                      profileData.userId,
                                      dispatch
                                    );
                                  }}
                                  class="btn btn-primary"
                                >
                                  Save
                                </button>
                              </div>{" "}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* <hr style=""/> */}

              {/* KPI Details */}
              <div className={isEdit ? "d-none" : "mt-4"}>
                <hr className="mt-0 p-0" />
                <div className="row">
                  {kpiDetails(values).map((itm, idx) =>
                    !itm.isInput ? (
                      <div key={idx} className="col-lg-3">
                        <ISelect
                          value={values[itm.name]}
                          {...itm}
                          setFieldValue={setFieldValue}
                        />
                      </div>
                    ) : (
                      <div key={idx} className="col-lg-6">
                        <IInput
                          value={values.kpiname}
                          label="KPI Name"
                          name="kpiname"
                          // disabled={true}
                        />
                      </div>
                    )
                  )}
                  <div className="col-lg-3">
                    <ISelect
                      label="Select Target Freq."
                      options={frequencyDDL}
                      defaultValue={values.targetFrequency}
                      name="targetFrequency"
                      values={values}
                      setFieldValue={setFieldValue}
                      dependencyFunc={(currentValue, values) => {
                        getStrategicParticularsGridActionDispatcher(
                          currentValue,
                          year || values.year
                        );
                      }}
                      errors={errors}
                      touched={touched}
                      // values={values}/
                    />
                  </div>
                  <div className="col-lg-3">
                    <IInput
                      label="Operator"
                      name="operator"
                      type="text"
                      // onChange={(e) => {
                      //   setAllValue(e.target.value);
                      // }}
                      value={values?.operator}
                    />
                  </div>
                  <div className="col-lg-3">
                    <IInput
                      label="Benchmark"
                      name="benchmark"
                      type="number"
                      value={values?.benchmark}
                    />
                  </div>
                  <div className="col-lg-3">
                    <IInput
                      label="Set Target For All"
                      name="allValue"
                      type="number"
                      step="any"
                      onChange={(e) => {
                        setAllValue(e.target.value);
                      }}
                      disabled={!strategicParticularsGrid}
                      value={allValue}
                    />
                  </div>
                </div>
              </div>
              <div>
                {strategicParticularsGrid ? (
                  <KpiEntryGrid
                    pmsfrequencyId={values.targetFrequency?.value}
                    frequencyName={values.targetFrequency?.label}
                    startDate={values.startDate}
                    values={values}
                    allValue={allValue}
                    endDate={values.endDate}
                    objRowTargetAchivment={objRowTargetAchivment}
                    rowDtoHandler={rowDtoHandler}
                    strategicParticularsGrid={strategicParticularsGrid}
                  />
                ) : (
                  ""
                )}
              </div>

              <KpiReportTable
                deleteIndividualKPIById={deleteIndividualKPIById}
                values={values}
                report={report}
              />

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
                  setIsCopyKPI(false);
                }}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
