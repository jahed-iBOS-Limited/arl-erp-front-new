import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";

// Validation schema
const validationSchema = Yup.object().shape({
  costCenterTypeName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Controlling Unit Name is required"),
  controllingUnit: Yup.object().shape({
    label: Yup.string().required("Controlling Unit is required"),
    value: Yup.string().required("Controlling Unit is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  controllingUnitDDL,
  isEdit,
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
              <div className="form-group row">
                <div className="col-lg-6">
                  <Field
                    value={values.costCenterTypeName || ""}
                    name="costCenterTypeName"
                    component={Input}
                    placeholder="Type Name"
                    label="Type Name"
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors &&
                    errors.costCenterTypeName &&
                    touched && touched.costCenterTypeName
                      ? errors.costCenterTypeName.value
                      : ""}
                  </p>
                </div>
                <div className="col-lg-6">
                  <label>Select Controlling Unit</label>
                  <Field
                    name="controllingUnit"
                    placeholder="Select Controlling Unit"
                    component={() => (
                      <Select
                        options={controllingUnitDDL}
                        placeholder="Select Controlling Unit"
                        value={values?.controllingUnit}
                        onChange={(valueOption) => {
                          console.log(valueOption);
                          setFieldValue("controllingUnit", valueOption);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                      />
                    )}
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors && errors.controllingUnit
                      ? errors.controllingUnit.value
                      : ""}
                  </p>
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
