import React from "react";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import NewSelect from "../../../../_helper/_select";

// Validation schema
const validationSchema = Yup.object().shape({
  designationName: Yup.string().required("Designation Name is required"),
  designationCode: Yup.string().required("Designation Code is required"),
  // businessUnit: Yup.object().shape({
  //   value: Yup.string().required("Business unit is required"),
  //   label: Yup.string().required("Business unit is required"),
  // }),
  position: Yup.object().shape({
    value: Yup.string().required("Position is required"),
    label: Yup.string().required("Position is required"),
  }),
});

// Validation schema for Edit
const editValidationSchema = Yup.object().shape({
  designationName: Yup.string().required("Designation Name is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  businessUnitDDL,
  positiontDDL,
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
                <div className="col-lg-3">
                  <Field
                    value={values?.designationName}
                    name="designationName"
                    component={Input}
                    placeholder="Designation Name"
                    label="Designation Name"
                  />
                </div>
                <div className="col-lg-3">
                  <Field
                    value={values?.designationCode}
                    name="designationCode"
                    component={Input}
                    placeholder="Designation Code"
                    label="Designation Code"
                    disabled={isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="position"
                    options={positiontDDL}
                    value={values?.position}
                    label="Position"
                    onChange={(valueOption) => {
                      setFieldValue("position", valueOption);
                    }}
                    placeholder="Select Position"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
                {/* <div className="col-lg-3">
                  
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
                      disabled={isEdit}
                      isDisabled={isEdit}
                      
                    />
                  
                </div> */}
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
