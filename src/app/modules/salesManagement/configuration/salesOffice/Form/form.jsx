import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { IInput } from "../../../../_helper/_input";

// Validation schema
const validationSchema = Yup.object().shape({
  salesOrganization: Yup.object().shape({
    label: Yup.string().required("Sales Organization is required"),
    value: Yup.string().required("Sales Organization is required"),
  }),
  salesOfficeName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Sales Office Name is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  saleOrgDDL,
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
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-4">
                  <ISelect
                    options={saleOrgDDL}
                    label="Sales Organization"
                    value={values.salesOrganization}
                    setFieldValue={setFieldValue}
                    name="salesOrganization"
                    touched={touched}
                    errors={errors}
                    isDisabled={isEdit}
                  />
                </div>
                <div className="col-lg-4">
                  <IInput
                    name="salesOfficeName"
                    value={values.salesOfficeName}
                    label="Sales Office Name"
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
