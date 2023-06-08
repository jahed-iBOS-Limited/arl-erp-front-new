import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";

// Validation schema
const validationSchema = Yup.object().shape({
  transportOrganizationName: Yup.string().required(
    "Transport Organization Name is required"
  ),
  code: Yup.string().required("Code is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  isEdit,
}) {
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
        {({ handleSubmit, resetForm, values, errors, touched, isValid }) => (
          <>
            {/* {disableHandler(!isValid)} */}

            <Form className="form form-label-right global-form">
              <div className="form-group row">
                <div className="col-lg-4">
                  <label>Transport Organization Name</label>
                  <InputField
                    value={values?.transportOrganizationName}
                    name="transportOrganizationName"
                    placeholder="Transport Organization Name"
                    type="text"
                  />
                </div>

                <div className="col-lg-4">
                  <label>Code</label>
                  <InputField
                    value={values?.code}
                    name="code"
                    placeholder="Code"
                    type="text"
                  />
                </div>

                {/* end row div */}
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
