import React from "react";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
// import NewSelect from "../../../../_helper/_select";

// Validation schema
const validationSchema = Yup.object().shape({
  employmentType: Yup.string().required("Employment Type is required"),
  // businessUnit: Yup.object().shape({
  //   value: Yup.string().required("Business unit is required"),
  //   label: Yup.string().required("Business unit is required"),
  // }),
});

// Validation schema for Edit
const editValidationSchema = Yup.object().shape({
  employmentType: Yup.string().required("Employment Type is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  businessUnitDDL,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={isEdit ? editValidationSchema : validationSchema}
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
                {/* <div className="col-lg-3">
                  {isEdit ? (
                    <Field
                      value={values?.businessUnit}
                      name="businessUnit"
                      component={Input}
                      placeholder="Business Unit"
                      label="Business Unit"
                      disabled={isEdit}
                    />
                  ) : (
                    <NewSelect
                      name="businessUnit"
                      options={businessUnitDDL}
                      value={values?.businessUnit}
                      label="Business Unit"
                      onChange={(valueOption) => {
                        setFieldValue("businessUnit", valueOption);
                      }}
                      placeholder="Select Business Unit"
                      errors={errors}
                      touched={touched}
                    />
                  )}
                </div> */}
                <div className="col-lg-3">
                  <Field
                    value={values?.employmentType}
                    name="employmentType"
                    component={Input}
                    placeholder="Employment Type"
                    label="Employment Type"
                  />
                </div>
                <div className="col-lg-3 mt-4 d-flex align-items-center">
                  <input
                    type="checkbox"
                    value={values?.isConsolidated}
                    checked={values?.isConsolidated}
                    onChange={(e) => {
                      setFieldValue("isConsolidated", e.target.checked);
                    }}
                  />
                  <label className="pl-2">Is Consolidated</label>
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
