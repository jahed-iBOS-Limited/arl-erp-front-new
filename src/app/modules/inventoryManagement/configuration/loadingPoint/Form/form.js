import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";

// Validation schema
const validationSchema = Yup.object().shape({
  shipPointName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Shipping Point Name"),
  loadingPointName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Loading Point 100 symbols")
    .required("Loading Point is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  businessUnit,
  ShipPointDDL,
  isEdit,
  ty,
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
                <div className="col-lg-3">
                  <label>Select Shipping Point</label>
                  <Field
                    name="shipPointName"
                    placeholder="Select Shipping Point"
                    component={() => (
                      <Select
                        options={ShipPointDDL}
                        placeholder="Select Shipping Point"
                        defaultValue={values.shipPointName}
                        onChange={(valueOption) => {
                          setFieldValue("shipPointName", valueOption);
                        }}
                        isDisabled={isEdit}
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
                    {errors &&
                    errors.shipPointName &&
                    touched && touched.shipPointName
                      ? errors.shipPointName.value
                      : ""}
                  </p>
                </div>

                <div className="col-lg-3">
                  <Field
                    value={values.loadingPointName || ""}
                    name="loadingPointName"
                    component={Input}
                    placeholder="Loading Point Name"
                    label="Loading Point Name"
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
