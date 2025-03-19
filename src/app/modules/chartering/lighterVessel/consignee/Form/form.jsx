import { Formik } from "formik";
import React from "react";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import { validationSchema } from "../helper";

export default function _Form({ title, initData, saveHandler }) {
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
        {({ handleSubmit, values, errors, touched }) => (
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
                      value={values?.consigneeName}
                      name="consigneeName"
                      label="Consignee Name"
                      placeholder="Consignee Name"
                      type="text"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikInput
                      value={values?.mobileNo}
                      name="mobileNo"
                      label="Mobile No"
                      placeholder="Mobile No"
                      type="text"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikInput
                      value={values?.email}
                      name="email"
                      label="Email"
                      placeholder="Email"
                      type="text"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikInput
                      value={values?.address}
                      name="address"
                      label="Address"
                      placeholder="Address"
                      type="text"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikInput
                      value={values?.bankAccountNo}
                      name="bankAccountNo"
                      label="Bank Account No"
                      placeholder="Bank Account No"
                      type="text"
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
