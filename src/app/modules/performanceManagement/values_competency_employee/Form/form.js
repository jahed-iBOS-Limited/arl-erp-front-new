import React, {useEffect} from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../_helper/_inputDropDown";
import MeasuringScale from "../../_helper/_measuringScale";
import ValuesTable from "../Table/_valuesTable";
import CompetencyTable from "../Table/_competencyTable";
import { useDispatch, useSelector, shallowEqual} from "react-redux";
import {
  getEmployeeBasicInfoByIdAction,
  SetCompetencyEmptyAction,
  SetEmployeeBasicInfoEmptyAction,
  SetValAndCompByEmpIdEmptyAction,
  SetValuesListEmptyAction,
  getMeasuringScaleAction,
  getMeasuringScaleBottomAction
} from "../../_redux/Actions";
// Validation schema
const validationSchema = Yup.object().shape({
  year: Yup.object().shape({
    label: Yup.string().required("Year is required"),
    value: Yup.string().required("Year is required"),
  }),
  // quarter: Yup.object().shape({
  //   label: Yup.string().required("Quarter is required"),
  //   value: Yup.string().required("Quarter is required"),
  // }),
  type: Yup.string(),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  employeeBasicInfo,
  yearDDL,
  valueList,
  competencyList,
  setYear,
  vcData,
  year,
  valuesData,
  setValuesData,
  competencyData,
  setCompetencyData,
  getValuesAndCompByEmpIdAction,
  profileData,
  getValueAndCompList,
  empDDL,
}) {
  let dispatch = useDispatch();

  let data = useSelector((state) => {
    return {
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
      measureScaleTop: state.performanceMgt.measuringScale,
      measuringScaleButtom: state.performanceMgt.measuringScaleButtom,
    };
  });
  let { selectedBusinessUnit, measureScaleTop, measuringScaleButtom } = data;

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      dispatch(
        getMeasuringScaleAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
      dispatch(
        getMeasuringScaleBottomAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
      
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  // VALUES calculation
  const getValueMeasureBySupervisor = vcData
    ?.filter((itm) => itm?.typeId === 2)
    .reduce((acc, val) => acc + val?.numMeasureValueBySupervisor, 0);
  const getValueMeasureBySupervisorEmp = vcData
    ?.filter((itm) => itm?.typeId === 2)
    .reduce((acc, val) => acc + val?.numMeasureValueByEmployee, 0);

  // if not save
  const valueMeasureByEmployee = Object.values(valuesData).reduce(
    (acc, val) => acc + val?.measureValue,
    0
  );

  //COMPETENCY calculation
  const getcomMeasureByEmployee = vcData
    ?.filter((itm) => itm?.typeId === 3)
    .reduce((acc, val) => acc + val?.numMeasureValueByEmployee, 0);
  const getComMeasureBySupervisor = vcData
    ?.filter((itm) => itm?.typeId === 3)
    .reduce((acc, val) => acc + val?.numMeasureValueBySupervisor, 0);
  // if not save
  const comMeasureBySupervisor = Object.values(competencyData).reduce(
    (acc, val) => acc + val?.measureValue,
    0
  );

  //userRole Permission start
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const employeeEntry = userRole?.filter(
    (item) => item?.strFeatureName === "Employee Entry Public"
  );

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          year: { value: yearDDL[0]?.value, label: yearDDL[0]?.label },
          searchEmployee: {
            value: profileData.userId,
            label: profileData.userName,
          },
        }}
        validationSchema={validationSchema}
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
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {disableHandler(!isValid || vcData?.length)}
            <Form className="form form-label-right">
              <div className="row my-4">
                <div className="col-lg-3">
                  <div
                    role="group"
                    aria-labelledby="my-radio-group"
                    className="d-flex justify-content-between"
                  >
                    <label>
                      <Field
                        component={() => (
                          <input
                            type="radio"
                            name="type"
                            checked={values.type === "private"}
                            className="mr-2 pointer"
                            onChange={(e) => {
                              setFieldValue("searchEmployee", {
                                value: profileData.userId,
                                label: profileData.userName,
                              });
                              setFieldValue("type", "private");
                              dispatch(
                                getValuesAndCompByEmpIdAction(
                                  profileData?.userId,
                                  yearDDL[0]?.value
                                )
                              );
                              getValueAndCompList(profileData.userId);
                              dispatch(
                                getEmployeeBasicInfoByIdAction(
                                  profileData?.userId
                                )
                              );
                            }}
                          />
                        )}
                      />
                      Private
                    </label>
                    {employeeEntry[0]?.isCreate === true ? (
                      <label>
                      <Field
                        component={() => (
                          <input
                            type="radio"
                            name="type"
                            checked={values?.type === "public"}
                            className="mr-2 pointer"
                            onChange={(e) => {
                              setFieldValue("type", "public");
                              setFieldValue("searchEmployee", "");
                              dispatch(SetValAndCompByEmpIdEmptyAction());
                              dispatch(SetEmployeeBasicInfoEmptyAction());
                              dispatch(SetValuesListEmptyAction());
                              dispatch(SetCompetencyEmptyAction());
                            }}
                          />
                        )}
                      />
                      Public
                    </label>
                    ) : ''
                  }
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <div className="col-lg-3">
                  <ISelect
                    label="Search Employee"
                    options={empDDL}
                    defaultValue={values.searchEmployee}
                    name="searchEmployee"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    values={values}
                    dependencyFunc={(currentValue, values, setter) => {
                      setValuesData([]);
                      setCompetencyData([]);
                      setYear(values.year.value);
                      dispatch(getEmployeeBasicInfoByIdAction(currentValue));
                      if (profileData && values.year.value) {
                        dispatch(
                          getValuesAndCompByEmpIdAction(
                            currentValue,
                            values.year.value
                          )
                        );
                        getValueAndCompList(currentValue);
                      }
                    }}
                    isDisabled={values.type === "private"}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    isDisabled={!values.searchEmployee}
                    label="Select year"
                    options={yearDDL}
                    value={values.year}
                    name="year"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    values={values}
                    dependencyFunc={(currentValue, values, setter) => {
                      setValuesData([]);
                      setCompetencyData([]);
                      setYear(currentValue);
                      dispatch(
                        getValuesAndCompByEmpIdAction(
                          values.searchEmployee.value,
                          currentValue
                        )
                      );
                      getValueAndCompList();
                    }}
                  />
                </div>
                {/* <div className="col-lg-3">
                  <ISelect
                    label="Select Quarter"
                    options={[]}
                    value={values?.quarter}
                    name="quarter"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    values={values}
                    dependencyFunc={(currentValue, values, setter) => {
                      setYear(currentValue);
                    }}
                  />
                </div> */}
                {employeeBasicInfo && (
                  <p className="pl-3 mt-3 employee_info">
                    <b>Designation</b>: {employeeBasicInfo?.designationName},{" "}
                    <b>Department</b>: {employeeBasicInfo?.departmentName},{" "}
                    <b>Supervisor</b>: {employeeBasicInfo?.supervisorName},{" "}
                    <b>Sbu</b>: {employeeBasicInfo?.sbuName},{" "}
                    <b>Business Unit</b>: {employeeBasicInfo?.businessUnitName}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <h5 className="mb-1">VALUES</h5>
                <hr className="mt-0 p-0" />
                <div className="d-flex justify-content-between">
                  <div style={{ width: "50%" }}>
                    <ValuesTable
                      headerName="Values Name"
                      isEmployee={true}
                      data={valueList}
                      vcData={vcData}
                      viewModalPath="/performance-management/employee-entry/view"
                      valuesData={valuesData}
                      setValuesData={setValuesData}
                      type="values"
                    />
                  </div>

                  <MeasuringScale
                    measureByEmployee={
                      valueMeasureByEmployee || getValueMeasureBySupervisorEmp
                    }
                    measureScale={measureScaleTop}
                    measureBySupervisor={getValueMeasureBySupervisor}
                  />
                </div>
              </div>
              <div className="mt-4">
                <h5 className="mb-1">COMPETENCIES</h5>
                <hr className="mt-0 p-0" />
                <div className="d-flex justify-content-between">
                  <div style={{ width: "50%" }}>
                    <CompetencyTable
                      headerName="Competency Name"
                      isEmployee={true}
                      data={competencyList}
                      vcData={vcData}
                      competencyData={competencyData}
                      setCompetencyData={setCompetencyData}
                      viewModalPath="/performance-management/employee-entry/view"
                    />
                  </div>

                  <MeasuringScale
                    measureByEmployee={
                      getcomMeasureByEmployee || comMeasureBySupervisor
                    }
                    measureScale={measuringScaleButtom}
                    measureBySupervisor={getComMeasureBySupervisor}
                  />
                </div>
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
