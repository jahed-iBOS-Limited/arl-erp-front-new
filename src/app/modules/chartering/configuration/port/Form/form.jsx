import { Formik } from "formik";
import React from "react";
import { useHistory } from "react-router";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import { validationSchema } from "../helper";

export default function _Form({
  title,
  initData,
  saveHandler,
  viewType,
  countryDDL,
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
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>{title}</p>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      history.goBack();
                    }}
                    className={"btn btn-secondary px-3 py-2"}
                  >
                    <i className="fa fa-arrow-left pr-1"></i>
                    Back
                  </button>
                  {viewType !== "view" && (
                    <button
                      type="button"
                      onClick={() => resetForm(initData)}
                      className={"btn btn-info reset-btn ml-2 px-3 py-2"}
                    >
                      Reset
                    </button>
                  )}
                  {viewType !== "view" && (
                    <button
                      type="submit"
                      className={"btn btn-primary ml-2 px-3 py-2"}
                      onClick={handleSubmit}
                      disabled={false}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <label>Port Name</label>
                    <FormikInput
                      value={values?.portName}
                      name="portName"
                      placeholder="Port Name"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>

                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.portCountry}
                      isSearchable={true}
                      options={countryDDL || []}
                      styles={customStyles}
                      name="portCountry"
                      placeholder="Port Country"
                      label="Port Country"
                      onChange={(valueOption) => {
                        setFieldValue("portCountry", valueOption);
                      }}
                      isDisabled={viewType === "view"}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Port Address</label>
                    <FormikInput
                      value={values?.portAddress}
                      name="portAddress"
                      placeholder="Port Address"
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
