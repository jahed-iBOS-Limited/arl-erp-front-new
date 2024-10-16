import React from "react";
import { Formik } from "formik";
import { useHistory } from "react-router";

import { validationSchema } from "../helper";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import FormikInput from "../../../_chartinghelper/common/formikInput";

export default function _Form({
  title,
  initData,
  saveHandler,
  viewType,
  stakeholderTypeDDL,
  countryDDL,
  bankDDL,
  setBankDDL,
  businessPartnerDDL,
  portDDL,
}) {
  const history = useHistory();
  // const [show, setShow] = React.useState(false);
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
                      className={"btn btn-info px-3 py-2 reset-btn ml-2"}
                    >
                      Reset
                    </button>
                  )}
                  {viewType !== "view" && (
                    <button
                      type="submit"
                      className={"btn btn-primary px-3 py-2 ml-2"}
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
                    <FormikSelect
                      value={values?.stakeholderType}
                      isSearchable={true}
                      options={stakeholderTypeDDL}
                      styles={customStyles}
                      name="stakeholderType"
                      placeholder="Business Partner Type"
                      label="Business Partner Type"
                      onChange={(valueOption) => {
                        setFieldValue("stakeholderType", valueOption);
                      }}
                      isDisabled={viewType === "view"}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.businessPartner}
                      isSearchable={true}
                      options={businessPartnerDDL}
                      styles={customStyles}
                      name="businessPartner"
                      placeholder="Business Partner"
                      label="Business Partner"
                      onChange={(valueOption) => {
                        setFieldValue("businessPartner", valueOption);
                      }}
                      isDisabled={viewType === "view"}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Company Name</label>
                    <FormikInput
                      value={values?.companyName}
                      name="companyName"
                      placeholder="Company Name"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>PIC Name</label>
                    <FormikInput
                      value={values?.picname}
                      name="picname"
                      placeholder="PIC Name"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Mobile No</label>
                    <FormikInput
                      value={values?.mobileNo}
                      name="mobileNo"
                      placeholder="Mobile No"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Email</label>
                    <FormikInput
                      value={values?.email}
                      name="email"
                      placeholder="Email"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>

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
                    <FormikSelect
                      value={values?.port}
                      isSearchable={true}
                      options={portDDL || []}
                      styles={customStyles}
                      name="port"
                      placeholder="Port"
                      label="Port"
                      onChange={(valueOption) => {
                        setFieldValue("port", valueOption);
                      }}
                      isDisabled={viewType === "view"}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Address</label>
                    <FormikInput
                      value={values?.address}
                      name="address"
                      placeholder="Address"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                </div>
              </div>
              <div className="marine-form-card-content mt-3">
                <h6 className="font-weight-bold mb-2">Bank Information</h6>
                <div className="row">
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
                    <label>Bank Account Number</label>
                    <FormikInput
                      value={values?.bankAccountNo}
                      name="bankAccountNo"
                      placeholder="Bank Account Number"
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
                      value={values?.ibancode}
                      name="ibancode"
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
