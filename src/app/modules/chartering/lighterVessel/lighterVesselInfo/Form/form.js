import { Formik } from "formik";
import React from "react";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import { validationSchema } from "../helper";

export default function _Form({
  title,
  initData,
  saveHandler,
  costCenterDDL,
  revenueCenterDDL,
  sbuDDL,
  getCostCenter,
  profitCenterDDL,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            <form className="marine-modal-form-card">
              <div className="marine-form-card-heading">
                <p>{title}</p>
                <div>
                  <button
                    type="submit"
                    className={"btn btn-primary ml-2 px-3 py-2"}
                    onClick={handleSubmit}
                    disabled={false}
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <FormikInput
                      value={values?.lighterVesselName}
                      name="lighterVesselName"
                      label="Lighter Vessel Name"
                      placeholder="Lighter Vessel Name"
                      type="text"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikInput
                      value={values?.lastTripNo}
                      name="lastTripNo"
                      label="Last Trip No"
                      placeholder="Last Trip No"
                      type="number"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikInput
                      value={values?.capacity}
                      name="capacity"
                      label="Capacity"
                      placeholder="Capacity"
                      type="text"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.sbu || ""}
                      isSearchable={true}
                      options={sbuDDL || []}
                      styles={customStyles}
                      name="sbu"
                      label="SBU"
                      placeholder="SBU"
                      onChange={(valueOption) => {
                        getCostCenter(valueOption?.value);
                        setFieldValue("sbu", valueOption);
                        setFieldValue("costCenter", "");
                      }}
                      isDisabled={false}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.revenueCenter || ""}
                      isSearchable={true}
                      options={revenueCenterDDL || []}
                      styles={customStyles}
                      name="revenueCenter"
                      label="Revenue Center"
                      placeholder="Revenue Center"
                      onChange={(valueOption) => {
                        setFieldValue("revenueCenter", valueOption);
                      }}
                      isDisabled={false}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.costCenter || ""}
                      isSearchable={true}
                      options={costCenterDDL || []}
                      styles={customStyles}
                      name="costCenter"
                      label="Cost Center"
                      placeholder="Cost Center"
                      onChange={(valueOption) => {
                        setFieldValue("costCenter", valueOption);
                      }}
                      isDisabled={!values?.sbu}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.profitCenter || ""}
                      isSearchable={true}
                      options={profitCenterDDL || []}
                      styles={customStyles}
                      name="profitCenter"
                      placeholder="Profit Center"
                      label="Profit Center"
                      onChange={(valueOption) => {
                        setFieldValue("profitCenter", valueOption);
                      }}
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
