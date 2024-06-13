import React, { useRef, useState } from "react";
import { Formik } from "formik";
// import {
//   certificateAttachment_action,
//   getCertificateDDL,
//   validationSchema,
// } from "../helper";
import { useHistory } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import TextArea from "../../../_helper/TextArea";
import FormikInput from "../../_chartinghelper/common/formikInput";
import FormikSelect from "../../_chartinghelper/common/formikSelect";
import customStyles from "../../_chartinghelper/common/selectCustomStyle";
import { CreateIcon } from "../../lighterVessel/trip/Form/components/header";

export default function _Form({
  title,
  initData,
  saveHandler,
  viewType,
  vesselDDL,
  certificateTypeDDL,
  singleData,
  rowData,

  id,
}) {
  const history = useHistory();
  // eslint-disable-next-line no-unused-vars
  const dispatch = useDispatch();
  // attachment file
  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [certificateNameDDL, setCertificateNameDDL] = useState([]);
  console.log("certificateNameDDL", certificateNameDDL);

  console.log("InitData", initData);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            if (!id) {
              resetForm(initData);
            }
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
          setValues,
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
                      //disabled={!rowData?.length}
                    >
                      {console.log("errors", errors)}
                      Save
                    </button>
                  )}
                </div>
              </div>
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.vesselName || ""}
                      isSearchable={true}
                      options={vesselDDL || []}
                      styles={customStyles}
                      name="vesselName"
                      placeholder="Vessel Name"
                      label="Vessel Name"
                      onChange={(valueOption) => {
                        setFieldValue("vesselName", valueOption);
                      }}
                      isDisabled={viewType || rowData?.length}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.strCertificateTypeName || ""}
                      isSearchable={true}
                      options={certificateTypeDDL}
                      styles={customStyles}
                      name="strCertificateTypeName"
                      placeholder="Certificate Type"
                      label="Certificate Type"
                      onChange={(valueOption) => {
                        setFieldValue("strCertificateTypeName", valueOption);
                        // getCertificateDDL(
                        //   setCertificateNameDDL,
                        //   "CertificateDDL",
                        //   {
                        //     intAccountId: profileData?.accountId,
                        //     intBusinessUnitId: selectedBusinessUnit?.value,
                        //     intCertificateTypeId: valueOption?.value,
                        //   }
                        // );
                      }}
                      isDisabled={viewType}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3 relative">
                    <FormikSelect
                      value={values?.strCertificateName || ""}
                      isSearchable={true}
                      options={certificateNameDDL}
                      styles={customStyles}
                      name="strCertificateName"
                      placeholder="Name of Certificate "
                      label="Name of Certificate"
                      onChange={(valueOption) => {
                        setFieldValue("strCertificateName", valueOption);
                      }}
                      isDisabled={viewType}
                      errors={errors}
                      touched={touched}
                    />
                    {viewType === "create" ? (
                      <CreateIcon
                        onClick={() => {
                          history.push(
                            "/chartering/configuration/certificate/create"
                          );
                        }}
                      />
                    ) : null}
                  </div>
                  <div className="col-lg-3">
                    <label>Issue Date</label>
                    <FormikInput
                      value={values?.dteIssueDate}
                      name="dteIssueDate"
                      placeholder="Issue Date"
                      type="date"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  {values?.strCertificateName?.dateRangeTypeId === 1 ||
                  singleData?.intDateRangeTypeId === 1 ? (
                    <div className="col-lg-3">
                      <label>To Date</label>
                      <FormikInput
                        value={values?.dteToDate}
                        name="dteToDate"
                        placeholder="To Date"
                        type="date"
                        min={values?.dteFromDate}
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>
                  ) : values?.strCertificateName?.dateRangeTypeId === 2 ||
                    singleData?.intDateRangeTypeId === 2 ? (
                    <>
                      <div className="col-lg-3">
                        <label>From Date</label>
                        <FormikInput
                          value={values?.dteFromDate}
                          name="dteFromDate"
                          placeholder="From Date"
                          type="date"
                          //min={values?.dteFromDate}
                          errors={errors}
                          touched={touched}
                          disabled={viewType === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>To Date</label>
                        <FormikInput
                          value={values?.dteToDate}
                          name="dteToDate"
                          placeholder="To Date"
                          type="date"
                          min={values?.dteFromDate}
                          errors={errors}
                          touched={touched}
                          disabled={viewType === "view"}
                        />
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  <div className="col-lg-3">
                    <label>Issue Place</label>
                    <FormikInput
                      value={values?.strIssuePlace}
                      name="strIssuePlace"
                      placeholder="Issue Place"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Issuing Authority</label>
                    <FormikInput
                      value={values?.strIssuingAuthority}
                      name="strIssuingAuthority"
                      placeholder="Issuing Authority"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Last Survey</label>
                    <FormikInput
                      value={values?.dteLastSurvey}
                      name="dteLastSurvey"
                      placeholder="Last Survey"
                      type="date"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Remarks </label>
                    <TextArea
                      value={values?.strRemarks}
                      name="strRemarks"
                      placeholder="Remarks"
                      rows="1"
                      max={1000}
                      disabled={viewType === "view"}
                      errors={errors}
                      touched={touched}
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
