import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { getRepresentativeRank_api } from "../helper";

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
  // businessUnitDDL: Yup.object().shape({
  //   label: Yup.string().required("Business Unit is required"),
  //   value: Yup.string().required("Business Unit is required"),
  // }),
  taxCircleDDL: Yup.object().shape({
    label: Yup.string().required("Tax Circle is required"),
    value: Yup.string().required("Tax Circle is required"),
  }),
  representativeDDL: Yup.object().shape({
    label: Yup.string().required("Representative is required"),
    value: Yup.string().required("Representative is required"),
  }),
  // representativeRankDDL: Yup.object().shape({
  //   label: Yup.string().required("Representative Rank is required"),
  //   value: Yup.string().required("Representative Rank is required"),
  // }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  taxCircleDDL,
  taxZoneDDL,
  representativeDDL,
  representativeRankDDL,
  isEdit,
  isDisabled,
  disabled,
  selectedBusinessUnit,
  profileData,
  setRepresentativeRankDDL,
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
            {console.log("values",values)}
            <div className="global-form">
              <Form className="form form-label-right">
                <div className="form-group row">
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
                      disabled={isEdit}
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
                      disabled={isEdit}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values.returnSubmissionDate}
                      label="Return Submission"
                      name="returnSubmissionDate"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="representativeDDL"
                      options={representativeDDL || []}
                      value={values?.representativeDDL}
                      label="Representative"
                      onChange={(valueOption) => {
                        getRepresentativeRank_api(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          setRepresentativeRankDDL
                        );
                        setFieldValue("representativeDDL", valueOption);
                      }}
                      placeholder="Representative"
                      errors={errors}
                      touched={touched}
                      disabled={isEdit}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="representativeRankDDL"
                      options={representativeRankDDL || []}
                      value={values?.representativeRankDDL}
                      label="Representative Position"
                      onChange={(valueOption) => {
                        setFieldValue("representativeRankDDL", valueOption);
                      }}
                      placeholder="Representative Position"
                      errors={errors}
                      touched={touched}
                      disabled={isEdit}
                    />
                  </div>

                  <div className="col-lg-3">
                    <InputField
                      value={values.representativeAddress}
                      label="Representative Address"
                      name="representativeAddress"
                      placeHolder="Representative Address"
                      disabled={disabled}
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
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
