import React from "react";
import { Formik } from "formik";
import { useHistory } from "react-router";
import FormikInput from "../../../../../helper/common/formikInput";
import FormikSelect from "../../../../../helper/common/formikSelect";
import customStyles from "../../../../../helper/common/selectCustomStyle";
import { validationSchema } from "../helper";

export default function _Form({
  title,
  initData,
  saveHandler,
  viewType,
  countryDDL,
  setShow,
}) {
  const history = useHistory();
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
            <form className="form-card">
              <div className="form-card-heading">
                <p>{title}</p>
                <div>
                  {!setShow && (
                    <button
                      type="button"
                      onClick={() => {
                        history.goBack();
                      }}
                      className={"btn btn-secondary"}
                    >
                      <i className="fa fa-arrow-left pr-1"></i>
                      Back
                    </button>
                  )}
                  {viewType !== "view" && (
                    <button
                      type="button"
                      onClick={() => resetForm(initData)}
                      className={"btn btn-info reset-btn ml-2"}
                    >
                      Reset
                    </button>
                  )}
                  {viewType !== "view" && (
                    <button
                      type="submit"
                      className={"btn btn-primary ml-2"}
                      onClick={handleSubmit}
                      disabled={false}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
              <div className="form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.country}
                      isSearchable={true}
                      options={countryDDL || []}
                      styles={customStyles}
                      name="country"
                      placeholder="Country"
                      label="Country"
                      onChange={(valueOption) => {
                        setFieldValue("country", valueOption);
                      }}
                      isDisabled={viewType === "view"}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Bank Name</label>
                    <FormikInput
                      value={values?.bankName}
                      name="bankName"
                      placeholder="Bank Name"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Bank Address</label>
                    <FormikInput
                      value={values?.bankAddress}
                      name="bankAddress"
                      placeholder="Bank Address"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Swift Code</label>
                    <FormikInput
                      value={values?.swiftCode}
                      name="swiftCode"
                      placeholder="Swift Code"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>IBAN Code</label>
                    <FormikInput
                      value={values?.ibanCode}
                      name="ibanCode"
                      placeholder="IBAN Code"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                </div>
              </div>
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
