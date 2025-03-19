import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import PerformanceChart from "..";
import { getMonthDDLAction } from "../_redux/Actions";
import { useDispatch } from "react-redux";

// Validation schema
const validationSchema = Yup.object().shape({
  employee: Yup.object().shape({
    label: Yup.string().required("Employee Person is required"),
    value: Yup.string().required("Employee Person is required"),
  }),
  competency: Yup.object().shape({
    label: Yup.string().required("Competency Person is required"),
    value: Yup.string().required("Competency Person is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  isEdit,
  yearDDL,
  month,
  getReportAction,
  selectedBusinessUnit,
  profileData,
}) {
  const dispatch = useDispatch();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          year: { value: yearDDL[0]?.value, label: yearDDL[0]?.label },
          from: { value: month[0]?.value, label: month[0]?.label },
          to: {
            value: month[month.length - 1]?.value,
            label: month[month.length - 1]?.label,
          },
        }}
        validationSchema={isEdit ? Yup.object().shape({}) : validationSchema}
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
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg">
                  <ISelect
                    label="Year"
                    options={yearDDL || []}
                    defaultValue={values.year}
                    values={values}
                    name="year"
                    dependencyFunc={(value, values, setFieldValue) => {
                      dispatch(getMonthDDLAction(value));
                    }}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg">
                  <ISelect
                    label="From month"
                    options={month}
                    defaultValue={values.from}
                    values={values}
                    name="from"
                    isDisabled={!values.year}
                    dependencyFunc={(value, values, setFieldValue) => {}}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg">
                  <ISelect
                    label="To month"
                    options={month}
                    defaultValue={values.to}
                    isDisabled={!values.year}
                    values={values}
                    name="to"
                    dependencyFunc={(value, values, setFieldValue) => {}}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                
              </div>

              {/* {employeeBasicInfo && (
                  <p className="mt-1 employee_info">
                    <b>Enroll </b>: {employeeBasicInfo?.employeeId},{" "}
                        <b>Employee </b>: {employeeBasicInfo?.employeeFirstName},{" "}
                    <b> Designation </b>: {employeeBasicInfo?.designationName},{" "}
                    <b> Department </b>: {employeeBasicInfo?.departmentName},{" "}
                    <b> Supervisor </b>: {employeeBasicInfo?.supervisorName},{" "}
                    <b> SBU </b>: {employeeBasicInfo?.sbuName},{" "}
                    <b> Business Unit </b>:{" "}
                    {employeeBasicInfo?.businessUnitName}
                  </p>
                )} */}

              <div className="perform-chart">
                <PerformanceChart values={values} />
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
