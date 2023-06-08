import React from "react";
import { Formik } from "formik";
import { useHistory } from "react-router-dom";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import { validationSchema } from "../helper";

export default function _Form({
  title,
  initData,
  saveHandler,
  viewType,
  setLoading,
  certificateTypeDDL,
  rowData,
  id,
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
              {console.log("valuesssss", values)}
              <div className="marine-form-card-heading">
                <p>{"Certificate Name Create"}</p>
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
                      {console.log("err", errors)}
                      Save
                    </button>
                  )}
                </div>
              </div>
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-4">
                    <label>Certificate Name</label>
                    <FormikInput
                      value={values?.strCertificateName}
                      name="strCertificateName"
                      placeholder="Certificate Name"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-4">
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
                      }}
                      isDisabled={viewType === "view"}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-4">
                    <FormikSelect
                      value={values?.strDateRangeType || ""}
                      isSearchable={true}
                      options={[
                        { value: 1, label: "Single Date" },
                        { value: 2, label: "Date Range" },
                      ]}
                      styles={customStyles}
                      name="strDateRangeType"
                      placeholder="Date Range Type"
                      label="Single Date / Date Range"
                      onChange={(valueOption) => {
                        console.log("valllll", valueOption);
                        setFieldValue("strDateRangeType", valueOption);
                      }}
                      isDisabled={viewType === "view"}
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
