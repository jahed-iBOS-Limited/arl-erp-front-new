/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextArea from "./../../../../_helper/TextArea";
import InputField from "./../../../../_helper/_inputField";

// Validation schema
const validationSchema = Yup.object().shape({
  bonusName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(1000, "Maximum 1000 symbols")
    .required("Bonus Name is required"),
  // bonusDescription: Yup.string().required("Bonus Description is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
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
              <div className="global-form">
                <div className="row mb-2">
                  <div className="col-lg-3 mb-3">
                    <InputField
                      value={values?.bonusName}
                      label="Bonus Name"
                      placeholder="Bonus Name"
                      name="bonusName"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-3 mb-3">
                    <label>Bonus Description</label>
                    <TextArea
                      value={values?.bonusDescription}
                      name="bonusDescription"
                      placeholder="Bonus Description"
                      rows="3"
                      max={1000}
                      // errors={errors}
                      // touched={touched}
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
