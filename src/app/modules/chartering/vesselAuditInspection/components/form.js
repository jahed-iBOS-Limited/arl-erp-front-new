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
                      value={values?.vesselType || ""}
                      isSearchable={true}
                      options={[]}
                      styles={customStyles}
                      name="vesselType"
                      placeholder="Mother, Lighter"
                      label="Vessel Type"
                      onChange={(valueOption) => {
                        setFieldValue("vesselType", valueOption);
                        // gridData({ ...values, vesselName: valueOption });
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.vessel || ""}
                      isSearchable={true}
                      options={[]}
                      styles={customStyles}
                      name="vessel"
                      placeholder="Vessel/Ligher"
                      label="Vessel/Ligher"
                      onChange={(valueOption) => {
                        setFieldValue("vessel", valueOption);
                        // gridData({ ...values, certificateName: valueOption });
                      }}
                      // isDisabled={!values?.vesselName}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label> Date</label>
                    <FormikInput
                      value={values?.date}
                      name="date"
                      placeholder="Date"
                      type="date"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label> Position Of Vessel</label>
                    <FormikInput
                      value={values?.vesselPosition}
                      name="vesselPosition"
                      placeholder="Vessel Position"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label> Title</label>
                    <FormikInput
                      value={values?.title}
                      name="title"
                      placeholder="title"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  {/* ------------hide until clarification */}
                  {/* <div className="col-lg-3">
                    <FormikSelect
                      value={values?.type || ""}
                      isSearchable={true}
                      options={[]}
                      styles={customStyles}
                      name="type"
                      placeholder="PSC, Audit, ..."
                      label="Type"
                      onChange={(valueOption) => {
                        setFieldValue("type", valueOption);
                        // gridData({ ...values, vesselName: valueOption });
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.category || ""}
                      isSearchable={true}
                      options={[]}
                      styles={customStyles}
                      name="category"
                      placeholder="UAE PSC"
                      label="Category"
                      onChange={(valueOption) => {
                        setFieldValue("category", valueOption);
                        // gridData({ ...values, certificateName: valueOption });
                      }}
                      // isDisabled={!values?.vesselName}
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                  <div className="col-lg-12">
                    <hr />
                    <h6>Issue</h6>
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
