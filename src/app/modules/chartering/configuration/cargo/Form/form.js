import { Formik } from "formik";
import React from "react";
import { useHistory } from "react-router";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import { validationSchema } from "../helper";

export default function _Form({ title, initData, saveHandler, viewType }) {
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
                    <FormikSelect
                      value={values?.cargoGroup}
                      isSearchable={true}
                      options={[
                        { value: 1, label: "A" },
                        { value: 2, label: "B" },
                        { value: 3, label: "C" },
                      ]}
                      styles={customStyles}
                      name="cargoGroup"
                      placeholder="Cargo Group"
                      label="Cargo Group"
                      onChange={(valueOption) => {
                        setFieldValue("cargoGroup", valueOption);
                      }}
                      isDisabled={viewType === "view"}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Cargo Name</label>
                    <FormikInput
                      value={values?.cargoName}
                      name="cargoName"
                      placeholder="Cargo Name"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>SF (m³/t)</label>
                    <FormikInput
                      value={values?.sf}
                      name="sf"
                      placeholder="SF (m³/t)"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <p>Pre-Loading Survey</p>
                    <div className=" d-flex align-items-center mt-1">
                      <div className=" d-flex align-items-center">
                        <input
                          type="checkbox"
                          id="required"
                          value={values?.required}
                          checked={values?.required}
                          onChange={(e) => {
                            setFieldValue("required", e.target.checked);
                            setFieldValue("notRequired", !e.target.checked);
                          }}
                          name="required"
                          disabled={viewType === "view"}
                        />
                        <label htmlFor="required" className="pl-1">
                          Required
                        </label>
                      </div>
                      <div className=" d-flex align-items-center ml-2">
                        <input
                          type="checkbox"
                          id="notRequired"
                          value={values?.notRequired}
                          checked={values?.notRequired}
                          onChange={(e) => {
                            setFieldValue("notRequired", e.target.checked);
                            setFieldValue("required", !e.target.checked);
                          }}
                          name="notRequired"
                          disabled={viewType === "view"}
                        />
                        <label htmlFor="notRequired" className="pl-1">
                          Not Required
                        </label>
                      </div>
                    </div>
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
