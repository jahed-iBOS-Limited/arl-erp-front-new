import { Formik } from "formik";
import React from "react";
import FormikInput from "../../../_chartinghelper/common/formikInput";
// import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import { validationSchema } from "../helper";

export default function _Form({ title, initData, saveHandler, editViewTag }) {
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
                {editViewTag !== "view" && (
                  <div>
                    <button
                      type="submit"
                      className={"btn btn-primary ml-2 px-3 py-2"}
                      onClick={handleSubmit}
                      disabled={false}
                    >
                      {editViewTag === "edit" ? "Edit" : "Save"}
                    </button>
                  </div>
                )}
              </div>

              <div className="marine-form-card-content">
                <div className="row">
                  {/* <div className="col-lg-3">
                    <FormikInput
                      value={values?.motherVessel}
                      name="motherVessel"
                      label="Mother Vessel"
                      placeholder="Mother Vessel"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={editViewTag === "view"}
                    />
                  </div> */}
                  <div className="col-lg-3">
                    <FormikInput
                      value={values?.ref}
                      name="ref"
                      label="Ref"
                      placeholder="Ref"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={editViewTag === "view"}
                    />
                  </div>
                  {/* <div className="col-lg-3">
                    <FormikSelect
                      value={values?.cargo}
                      name="cargo"
                      label="Cargo"
                      placeholder="Cargo"
                      options={cargoDDL || []}
                      onChange={(valueOption) => {
                        setFieldValue("cargo", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={editViewTag === "view"}
                    />
                  </div> */}
                  <div className="col-lg-3">
                    <FormikInput
                      value={values?.lc}
                      name="lc"
                      label="LC"
                      placeholder="Lc"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={editViewTag === "view"}
                    />
                  </div>
                  {/* <div className="col-lg-3">
                    <FormikSelect
                      value={values?.unit}
                      name="unit"
                      label="Unit"
                      placeholder="Unit"
                      options={unitDDL || []}
                      onChange={(valueOption) => {
                        setFieldValue("unit", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={editViewTag === "view"}
                    />
                  </div> */}
                  <div className="col-lg-3">
                    <FormikInput
                      value={values?.arrivalDate}
                      name="arrivalDate"
                      label="Arrival Date"
                      placeholder="Arrival Date"
                      type="date"
                      errors={errors}
                      touched={touched}
                      disabled={editViewTag === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikInput
                      value={values?.quantity}
                      name="quantity"
                      label="B/L Quantity"
                      placeholder="B/L Quantity"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={editViewTag === "view"}
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
