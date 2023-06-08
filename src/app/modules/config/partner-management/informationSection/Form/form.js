import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";

// Validation schema
const validationSchema = Yup.object().shape({
  partnerSectionName: Yup.string()
    .required("Information Section Name is required")
    .matches(/^[A-Z a-z][A-Z a-z 0-9]*$/i, "Is not in correct format"),
  // .matches(
  //   /^([A-Za-z])$/,
  //   "Must Contain  One Uppercase, One Lowercase, One Number  Character"
  // ),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            console.log(values);
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, resetForm, values, isValid }) => (
          <>
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-3">
                  <InputField
                    value={values?.partnerSectionName}
                    label="Information Section Name"
                    name="partnerSectionName"
                    placeholder="Information Section Name"
                  />
                </div>
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
