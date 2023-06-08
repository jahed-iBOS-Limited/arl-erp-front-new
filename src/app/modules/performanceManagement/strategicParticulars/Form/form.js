/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import KpiEntryGrid from "./kpiEntryGrid";
import { IInput } from "../../../_helper/_input";
import { ISelect } from "../../../_helper/_inputDropDown";
import { getDepartmentDDLAction } from "../_redux/Actions";
import { SetStrategicParticularsGridEmpty } from "../_redux/Actions";
import { useDispatch } from "react-redux";
import { getCorporateDepDDLAction } from "./helper";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import axios from "axios";

// Validation schema
const validationSchema = Yup.object().shape({
  year: Yup.object().shape({
    label: Yup.string().required("Year is required"),
    value: Yup.string().required("Year is required"),
  }),
  targetFrequency: Yup.object().shape({
    label: Yup.string().required("Target Frequency Type is required"),
    value: Yup.string().required("Target Frequency Type is required"),
  }),
  strategicParticularsName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(500, "Maximum 500 symbols")
    .required("Particulars details is required"),
  planType: Yup.object().shape({
    label: Yup.string().required("Plan type is required"),
    value: Yup.string().required("Plan type is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  sbuDDL,
  strategicParticularsTypeDDL,
  empDDL,
  frequencyDDL,
  strategicObjectiveTypeDDL,
  yearDDL,
  getStrategicParticularsGridActionDispatcher,
  strategicParticularsGrid,
  bscPerspectiveDDL,
  frequencyId,
  strId,
  objListRow,
  depDDL,
  setDepDDL,
  accountId,
  selectedBusinessUnit,
}) {
  const [controlls, setControlls] = useState([]);
  const [kpiTargetEntry, setKpiTargetEntry] = useState({});
  const [allValue, setAllValue] = useState(0);
  const [ownerDepartment, setOwnerDepartment] = useState([])

  let dispatch = useDispatch();

  useEffect(() => {
    setControlls([
      {
        label: "Select SBU",
        name: "sbu",
        options: sbuDDL,
      },

      {
        label: "Select Department",
        name: "department",
        options: depDDL,
      },
      {
        label: "Select BSC Perspective",
        name: "bscPerspective",
        options: bscPerspectiveDDL,
      },
      {
        label: "Select Plan Type",
        name: "planType",
        options: [
          { value: 1, label: "5 Years" },
          { value: 2, label: "1 Years" },
          { value: 3, label: "BSC" },
          { value: 4, label: "Strategic Initiative" },
        ],
      },
      {
        label: "Select Strategic Particular Type ",
        name: "strategicParticularType",
        options: strategicParticularsTypeDDL,
        dependencyFunc: (currentValue, values, setter) => {
          setter("targetFrequency", "")
          dispatch(SetStrategicParticularsGridEmpty())
          currentValue === 1 &&
            setter("forObjective", { label: "null", value: 0 });
          currentValue !== 1 && setter("forObjective", "");
        },
      },
      {
        label: "Strategic Particulars Name",
        name: "strategicParticularsName",
        isInput: true,
        col: "col-lg-9",
      },
      {
        label: "Strategic Particulars Details",
        name: "description",
        isInput: true,
        col: "col-lg-12",
      },

      {
        label: "Select For Objective",
        name: "forObjective",
        options: strategicObjectiveTypeDDL,
      },
      {
        label: "Select Owner",
        name: "owner",
        options: ownerDepartment,
      },
      {
        label: "Select Priority",
        name: "priority",
        options: [
          { label: "High", value: 1 },
          { label: "Medium", value: 2 },
          { label: "Low", value: 3 },
        ],
      },
      {
        label: "Resource",
        name: "resource",
        type: "text",
        isInput: true,
      },
      {
        label: "Budget",
        name: "numBudget",
        type: "number",
        isInput: true,
        props: { min: 0 },
      },
      {
        label: "Target Area",
        name: "targetArea",
        type: "text",
        isInput: true,
      },
      {
        label: "Maxi/Mini",
        name: "maxi_mini",
        options: [
          { label: "Maximization", value: 1 },
          { label: "Minimization", value: 2 },
        ],
      },
      {
        label: "Select Aggregation Type",
        name: "aggregationType",
        options: [
          {
            label: "Average",
            value: "average",
          },
          {
            label: "Sum",
            value: "sum",
          },
        ],
      },
      {
        label: "Remarks ",
        name: "remarks",
        type: "text",
        isInput: true,
      },
      {
        label: "Select Current Year",
        name: "year",
        options: yearDDL,
      },
    ]);
  }, [
    sbuDDL,
    depDDL,
    strategicParticularsTypeDDL,
    empDDL,
    strategicObjectiveTypeDDL,
    yearDDL,
    bscPerspectiveDDL,
  ]);

  // Set and get value in rowdto
  const rowDtoHandler = (name, value, sl, obj) => {
    setKpiTargetEntry({
      ...kpiTargetEntry,
      [sl]: {
        ...kpiTargetEntry[sl],
        [name]: value,
        ...obj,
      },
    });
  };

  useEffect(() => {
    if (!strId) {
      const size = strategicParticularsGrid?.length;
      const key = frequencyId === 2 ? "monthId" : "quarterId";
      if (size) {
        const tempObj = {};
        strategicParticularsGrid.forEach((itm, idx) => {
          tempObj[idx] = {
            ...itm,
            [key]: itm.id,
            target: 0,
            pmsfrequencyId: frequencyId,
            remarks: "",
          };
        });
        setKpiTargetEntry(tempObj);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategicParticularsGrid]);

  useEffect(() => {
    if (strId) {
      const size = objListRow?.length;
      const key = frequencyId === 2 ? "monthId" : "quarterId";
      if (size) {
        const tempObj = {};
        objListRow.forEach((itm, idx) => {
          tempObj[idx] = {
            ...itm,
            [key]: itm.id,
            target: itm.numTarget,
            remarks: itm?.remarks,
            quarterId: itm.quarterId,
            pmsfrequencyId: frequencyId,
          };
        });
        setKpiTargetEntry(tempObj);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objListRow]);

  useEffect(() => {
    if (strId) {
      const size = objListRow?.length;
      if (size) {
        setKpiTargetEntry(
          Object.fromEntries(
            Array.from({ length: size }, (_, i) => [
              i,
              {
                ...kpiTargetEntry[i],
                target: +allValue,
                actualEndDate: "2020-09-27T12:37:16.694Z",
              },
            ])
          )
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allValue]);

  useEffect(() => {
    const size = strategicParticularsGrid?.length;
    if (size) {
      setKpiTargetEntry(
        Object.fromEntries(
          Array.from({ length: size }, (_, i) => [
            i,
            {
              ...kpiTargetEntry[i],
              target: +allValue,
              actualEndDate: "2020-09-27T12:37:16.694Z",
            },
          ])
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allValue]);

  const disabledHandler = (values, itm) => {
    let isDisabled = false;
    if (itm.name === "sbu" && !values.isForSbu) {
      isDisabled = true;
    } else if (itm.name === "department") {
      values.isForDepartment || values.isForCorporate
        ? (isDisabled = false)
        : (isDisabled = true);
    } else {
      isDisabled = false;
    }
    return isDisabled;
  };

  const loadUserList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMReport/GetARLEmployeeList?BusinessUnitId=${0}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  // get Department
  useEffect(() => {
    dispatch(
      getDepartmentDDLAction(accountId, selectedBusinessUnit?.value, setOwnerDepartment)
    );
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler({ header: values, rowDto: kpiTargetEntry }, () => {
            setAllValue(0);
            // resetForm(initData);
            // dispatch(setParticullersGridEmpty());
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
        }) => (
          <>
            {disableHandler(!isValid)}
            {console.log("values", values)}
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-3 d-flex justify-content-between text-center">
                  <div>
                    <label className="d-block" htmlFor="isForEmployee">
                      Employee
                    </label>
                    <Field
                      name={values.isForEmployee}
                      component={() => (
                        <input
                          id="isForEmployee"
                          type="checkbox"
                          value={values.isForEmployee || ""}
                          checked={values.isForEmployee}
                          name={values.isForEmployee || ""}
                          onChange={(e) => {
                            setFieldValue("isForEmployee", e.target.checked);
                          }}
                        />
                      )}
                      label="Employee"
                    />
                  </div>
                  <div>
                    <label className="d-block" htmlFor="isForDepartment">
                      Department
                    </label>
                    <Field
                      name={values.isForDepartment}
                      component={() => (
                        <input
                          id="isForDepartment"
                          type="checkbox"
                          value={values.isForDepartment || ""}
                          checked={values.isForDepartment}
                          name={values.isForDepartment || ""}
                          onChange={(e) => {
                            // setFieldValue("isForCorporate", false);
                            setFieldValue("isForDepartment", e.target.checked);
                            setFieldValue("department", "");
                            // set depDDL empty first, then call API
                            setDepDDL([]);
                            setFieldValue("department", "");
                            if (values?.isForCorporate) {
                              getCorporateDepDDLAction(
                                accountId,
                                selectedBusinessUnit?.value,
                                setDepDDL
                              );
                            } else {
                              dispatch(
                                getDepartmentDDLAction(
                                  accountId,
                                  selectedBusinessUnit?.value,
                                  setDepDDL
                                )
                              );
                            }
                          }}
                        />
                      )}
                      label="Department"
                    />
                  </div>
                  <div>
                    <label className="d-block" htmlFor="isForSbu">
                      SBU
                    </label>
                    <Field
                      name={values.isForSbu}
                      component={() => (
                        <input
                          id="isForSbu"
                          type="checkbox"
                          value={values.isForSbu || ""}
                          checked={values.isForSbu}
                          name={values.isForSbu || ""}
                          onChange={(e) => {
                            setFieldValue("isForSbu", e.target.checked);
                            setFieldValue("sbu", "");
                          }}
                        />
                      )}
                      label="SBU"
                    />
                  </div>
                  <div>
                    <label className="d-block" htmlFor="isForEmployee">
                      Corporate
                    </label>
                    <Field
                      name={values.isForCorporate}
                      component={() => (
                        <input
                          id="isForCorporate"
                          type="checkbox"
                          value={values.isForCorporate || ""}
                          checked={values.isForCorporate}
                          name={values.isForCorporate || ""}
                          onChange={(e) => {
                            // setFieldValue("isForDepartment", false);
                            setFieldValue("isForCorporate", e.target.checked);
                            // set depDDL empty first, then call API
                            setDepDDL([]);
                            setFieldValue("department", "");
                            if (e.target.checked) {
                              getCorporateDepDDLAction(
                                accountId,
                                selectedBusinessUnit?.value,
                                setDepDDL
                              );
                            } else {
                              dispatch(
                                getDepartmentDDLAction(
                                  accountId,
                                  selectedBusinessUnit?.value,
                                  setDepDDL
                                )
                              );
                            }
                          }}
                        />
                      )}
                      label="Corporate"
                    />
                  </div>
                </div>
                {controlls.map((itm, index) => {
                  return itm.isInput ? (
                    <div key={index} className={itm.col || "col-lg-3"}>
                      <IInput
                        name={itm.name}
                        value={values[itm.name]}
                        type={itm.type}
                        label={itm.label}
                        {...itm?.props}
                      />
                    </div>
                  ) : (
                    <div key={index} className="col-lg-3">
                      {(values?.strategicParticularType?.label === "Project" && itm?.name === "owner") ? 
                      <div>
                        <label>Employee</label>
                      <SearchAsyncSelect
                      selectedValue={values[itm.name]}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        setFieldValue(`${itm?.name}`, valueOption);
                      }}
                      loadOptions={loadUserList}
                    />
                      </div>
                      : 
                      
                      <ISelect
                        label={itm?.label}
                        options={itm?.options}
                        value={values[itm.name]}
                        dependencyFunc={itm?.dependencyFunc}
                        name={itm?.name}
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        isDisabled={
                          // (itm.name === "sbu" && !values.isForSbu) ||
                          // (itm.name === "department" && (values.isForDepartment || values.isForCorporate) ? false : true)
                          disabledHandler(values, itm)
                        }
                      />}
                      
                    </div>
                  );
                })}
                <div className="col-lg-3">
                  <ISelect
                    label="Select Target Freq."
                    isDisable={!values.year?.value}
                    options={frequencyDDL}
                    value={values.targetFrequency}
                    name="targetFrequency"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    isDisabled={strId ? true : !values.year || !values.strategicParticularType?.value}
                    // disabledFields={["year"]}
                    values={values}
                    dependencyFunc={(currentValue, values) =>
                      getStrategicParticularsGridActionDispatcher(
                        currentValue,
                        values
                      )
                    }
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    label="Set Target For All"
                    name="allValue"
                    type="number"
                    min="0"
                    onChange={(e) => {
                      setAllValue(e.target.value);
                    }}
                    value={allValue}
                  />
                </div>
                {console.log(initData)}
              </div>
              <div>
                {strategicParticularsGrid || objListRow?.length > 0 ? (
                  <KpiEntryGrid
                    allValue={allValue}
                    pmsfrequencyId={values.targetFrequency?.value}
                    frequencyName={values.targetFrequency?.label}
                    startDate={values.startDate}
                    values={values}
                    endDate={values.endDate}
                    kpiTargetEntry={kpiTargetEntry}
                    rowDtoHandler={rowDtoHandler}
                    strategicParticularsGrid={
                      strId ? objListRow : strategicParticularsGrid
                    }
                  />
                ) : (
                  ""
                )}
              </div>
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
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
