import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { IInput } from "../../../../_helper/_input";

// Validation schema
const validationSchema = Yup.object().shape({
  codeType: Yup.object().shape({
    label: Yup.string().required("Code Type is required"),
    value: Yup.string().required("Code Type is required"),
  }),
  prefix: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Prefix is required"),
  monthLength: Yup.object().shape({
    label: Yup.string().required("Month Length is required"),
    value: Yup.string().required("Month Length is required"),
  }),
  yearLength: Yup.object().shape({
    label: Yup.string().required("Year Length is required"),
    value: Yup.string().required("Year Length is required"),
  }),
  refreshType: Yup.object().shape({
    label: Yup.string().required("Refresh Type is required"),
    value: Yup.string().required("Refresh Type is required"),
  }),
  startLengthId: Yup.number()
    .min(0, "Minimum 0 range")
    .max(100000, "Maximum 100000 range")
    .required("Start Length is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  // disableHandler,
  codeTypeDDL,
  monthLengthDDL,
  yearLengthDDL,
  refreshTypeDDL,
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
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-3">
                  <ISelect
                    label="Code  Generagte Type"
                    options={codeTypeDDL}
                    value={values.codeType}
                    name="codeType"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    value={values.prefix}
                    label="Prefix"
                    name="prefix"
                    // disabled={isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Month Length"
                    options={monthLengthDDL}
                    value={values.monthLength}
                    name="monthLength"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Year Length"
                    options={yearLengthDDL}
                    value={values.yearLength}
                    name="yearLength"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Refresh Type"
                    options={refreshTypeDDL}
                    value={values.refreshType}
                    name="refreshType"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    type="number"
                    value={values.startLengthId}
                    label="Start Length"
                    name="startLengthId"
                    // disabled={isEdit}
                    min="0"
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
