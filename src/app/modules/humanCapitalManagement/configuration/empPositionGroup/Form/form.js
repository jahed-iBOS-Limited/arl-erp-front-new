/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";

const validationSchema = Yup.object().shape({
  employeePositionGroup: Yup.string()
    .required("Position Group is required"),
    code: Yup.string()
    .required("Code is required"),
 
});


export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  employeePositionDDL,
  singleDataState,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3">
                    <Field
                      value={values?.employeePositionGroup}
                      name="employeePositionGroup"
                      component={Input}
                      placeholder="Position Group"
                      label="Position Group"
                    />
                  </div>
                  <div className="col-lg-3">
                    <Field
                      value={values?.code}
                      name="code"
                      disabled={isEdit}
                      component={Input}
                      placeholder="Code"
                      label="Code"
                    />
                  </div>
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
