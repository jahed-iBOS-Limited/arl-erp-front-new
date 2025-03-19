import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../_helper/_inputDropDown";
import MeasuringScale from "../../_helper/_measuringScale";
import ValuesTable from "./_valuesTable";
import CompetencyTable from "./_competencyTable";
import {
  getEmployeeBasicInfoByIdAction,
  getValuesAndCompByEmpIdAction,
  getMeasuringScaleAction,
  getMeasuringScaleBottomAction,
} from "../../_redux/Actions";
// Validation schema
const validationSchema = Yup.object().shape({
  searchEmployee: Yup.object().shape({
    label: Yup.string().required("Employee is required"),
    value: Yup.string().required("Employee is required"),
  }),
  year: Yup.object().shape({
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
  employeeBasicInfo,
  empDDL,
  yearDDL,
  valueList,
  competencyList,
  valuesAndCompByEmpIdDispatcher,
  valuesData,
  setValuesData,
  competencyData,
  setCompetencyData,
  setValues,
  setCompetency,
}) {
  const dispatch = useDispatch();

  let data = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
      measureScaleTop: state.performanceMgt.measuringScale,
      measuringScaleButtom: state.performanceMgt.measuringScaleButtom,
    };
  });
  let {
    selectedBusinessUnit,
    measureScaleTop,
    measuringScaleButtom,
    profileData,
  } = data;

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
  const getValueMeasureBySupervisor = valueList
    ?.filter((itm) => itm?.typeId === 2)
    .reduce((acc, val) => acc + val?.numMeasureValueBySupervisor, 0);
  const getValueMeasureBySupervisorEmp = valueList
    ?.filter((itm) => itm?.typeId === 2)
    .reduce((acc, val) => acc + val?.numMeasureValueByEmployee, 0);
  // if not save
  const valueMeasureBySupervisor = Object.values(valuesData).reduce(
    (acc, val) => acc + val?.measureValue,
    0
  );

  //COMPETENCY calculation
  const getComValueMeasureBySupervisor = competencyList
    ?.filter((itm) => itm?.typeId === 3)
    .reduce((acc, val) => acc + val?.numMeasureValueBySupervisor, 0);
  const getComValueMeasureBySupervisorEmp = competencyList
    ?.filter((itm) => itm?.typeId === 3)
    .reduce((acc, val) => acc + val?.numMeasureValueByEmployee, 0);
  // if not save
  const comValueMeasureBySupervisor = Object.values(competencyData).reduce(
    (acc, val) => acc + val?.measureValue,
    0
  );

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          year: { value: yearDDL[0]?.value, label: yearDDL[0]?.label },
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            dispatch(
              getValuesAndCompByEmpIdAction(
                values.searchEmployee.value,
                values.year.value
              )
            );
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
            {disableHandler(
              valueList[0]?.measureNameBySupervisor || !valueList.length
                ? true
                : false
            )}
            <Form className="form form-label-right">
              {/* Set Kpi */}
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
                      dispatch(getEmployeeBasicInfoByIdAction(currentValue));
                      dispatch(
                        getValuesAndCompByEmpIdAction(
                          currentValue,
                          values.year.value
                        )
                      );
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Select year"
                    options={yearDDL}
                    value={values.year}
                    name="year"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    values={values}
                    isDisabled={!values.searchEmployee}
                    dependencyFunc={(currentValue, values, setter) => {
                      dispatch(
                        getValuesAndCompByEmpIdAction(
                          values.searchEmployee.value,
                          currentValue
                        )
                      );

                      setValues([]);
                      setCompetency([]);
                    }}
                  />
                </div>
                {/* {controlls.map((itm, index) => {
                  return itm.isDropdown ? (
                    <div className="col-lg-3">
                      <ISelect
                        label={itm.label}
                        options={itm.options}
                        value={values[itm.name]}
                        values={values}
                        name={itm.name}
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        dependencyFunc={itm.dependencyFunc}
                        isDisabled={
                          itm?.name === "year" &&
                          !values?.searchEmployee &&
                          true
                        }
                        defaultValue={itm.options[0]}
                      />
                    </div>
                  ) : (
                    <div className="col-lg-3">
                      <IInput
                        value={itm?.value}
                        label={itm.label}
                        name={itm.name}
                        disabled={true}
                      />
                    </div>
                  );
                })} */}
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
                <h5 className="mb-1 text-uppercase">Values</h5>
                <hr className="mt-0 p-0" />
                <div className="d-flex justify-content-between">
                  <div style={{ width: "50%" }}>
                    <ValuesTable
                      headerName="Values Name"
                      data={valueList}
                      viewModalPath="/performance-management/sup_entry/view"
                      valuesData={valuesData}
                      setValuesData={setValuesData}
                    />
                  </div>
                  <MeasuringScale
                    measureByEmployee={getValueMeasureBySupervisorEmp}
                    measureBySupervisor={
                      valueMeasureBySupervisor || getValueMeasureBySupervisor
                    }
                    measureScale={measureScaleTop}
                  />
                </div>
              </div>
              <div className="mt-4">
                <h5 className="mb-1 text-uppercase">Competency</h5>
                <hr className="mt-0 p-0" />
                <div className="d-flex justify-content-between">
                  <div style={{ width: "50%" }}>
                    <CompetencyTable
                      headerName="Competency Name"
                      data={competencyList}
                      viewModalPath="/performance-management/sup_entry/view"
                      competencyData={competencyData}
                      setCompetencyData={setCompetencyData}
                    />
                  </div>
                  <MeasuringScale
                    measureByEmployee={getComValueMeasureBySupervisorEmp}
                    measureBySupervisor={
                      comValueMeasureBySupervisor ||
                      getComValueMeasureBySupervisor
                    }
                    measureScale={measuringScaleButtom}
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
