import { Formik } from "formik";
import React from "react";
import FormikInput from "../../../../_chartinghelper/common/formikInput";
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
                  <div className="col-lg-6">
                    <FormikInput
                      value={values?.portName}
                      name="portName"
                      label="Port Name"
                      placeholder="Port Name"
                      type="text"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormikInput
                      value={values?.portAddress}
                      name="portAddress"
                      label="Port Address"
                      placeholder="Port Address"
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
