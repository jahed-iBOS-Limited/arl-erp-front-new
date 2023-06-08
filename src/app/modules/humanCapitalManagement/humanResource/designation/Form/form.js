import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";

// Validation schema
const validationSchema = Yup.object().shape({
  designationName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Department is required"),
  designationCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Middle Name 100 symbols")
    .required("Code is required"),
  remarks: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Last Name 100 symbols")
    .required("Comments is required"),
  
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  businessUnit,
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
  
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
              <div className="form-group row">
                  <div className="col-lg-3">
                    <Field
                      value={values.designationName || ""}
                      name="designationName"
                      component={Input}
                      disabled={isEdit}
                      placeholder="Designation"
                      label="Designation"
                    />
                  </div>

                <div className="col-lg-3">
                  <Field
                      value={values.designationCode || ""}
                      name="designationCode"
                      component={Input}
                      disabled={isEdit}
                      placeholder="Code"
                      label="Code"
                  />
                </div>
                  <div className="col-lg-3">
                    <Field
                      value={values.remarks || ""}
                      name="remarks"
                      component={Input}
                   
                      placeholder="Comments"
                      label="Comments"
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
