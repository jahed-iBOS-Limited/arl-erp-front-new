import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";

// Validation schema
const validationSchema = Yup.object().shape({
  representativeAddress: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Representative Address is required"),
  returnSubmissionDate: Yup.string().required("Return Submission is required"),
  taxZoneDDL: Yup.object().shape({
    label: Yup.string().required("Tax Zone is required"),
    value: Yup.string().required("Tax Zone is required"),
  }),
  businessUnitDDL: Yup.object().shape({
    label: Yup.string().required("Business Unit is required"),
    value: Yup.string().required("Business Unit is required"),
  }),
  taxCircleDDL: Yup.object().shape({
    label: Yup.string().required("Tax Circle is required"),
    value: Yup.string().required("Tax Circle is required"),
  }),
  representativeDDL: Yup.object().shape({
    label: Yup.string().required("Representative is required"),
    value: Yup.string().required("Representative is required"),
  }),
  representativeRankDDL: Yup.object().shape({
    label: Yup.string().required("Representative Rank is required"),
    value: Yup.string().required("Representative Rank is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  taxCircleDDL,
  taxZoneDDL,
  businessUnitDDL,
  representativeDDL,
  representativeRankDDL,
  isEdit,
  isDisabled,
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
                {/* console.log(empDDL); */}
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnitDDL"
                    options={businessUnitDDL || []}
                    value={values?.businessUnitDDL}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("businessUnitDDL", valueOption);
                    }}
                    placeholder="Business Unit"
                    errors={errors}
                    touched={touched}
                    isDisabled={isDisabled}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="taxZoneDDL"
                    options={taxZoneDDL || []}
                    value={values?.taxZoneDDL}
                    label="Tax Zone"
                    onChange={(valueOption) => {
                      setFieldValue("taxZoneDDL", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    placeholder="Tax Zone"
                    isDisabled={isDisabled}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="taxCircleDDL"
                    options={taxCircleDDL || []}
                    value={values?.taxCircleDDL}
                    label="Tax Circle"
                    onChange={(valueOption) => {
                      setFieldValue("taxCircleDDL", valueOption);
                    }}
                    placeholder="Tax Circle"
                    errors={errors}
                    touched={touched}
                    isDisabled={isDisabled}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values.returnSubmissionDate}
                    label="Return Submission"
                    name="returnSubmissionDate"
                    type="date"
                    disabled={isDisabled}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="representativeDDL"
                    options={representativeDDL || []}
                    value={values?.representativeDDL}
                    label="Representative"
                    onChange={(valueOption) => {
                      setFieldValue("representativeDDL", valueOption);
                    }}
                    placeholder="Representative"
                    errors={errors}
                    touched={touched}
                    isDisabled={isDisabled}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="representativeRankDDL"
                    options={representativeRankDDL || []}
                    value={values?.representativeRankDDL}
                    label="Representative Rank"
                    onChange={(valueOption) => {
                      setFieldValue("representativeRankDDL", valueOption);
                    }}
                    placeholder="Representative Rank"
                    errors={errors}
                    touched={touched}
                    isDisabled={isDisabled}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values.representativeAddress}
                    label="Representative Address"
                    name="representativeAddress"
                    disabled={isDisabled}
                    placeHolder="Representative Address"
                    // disabled={isEdit}
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
