/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useState } from "react";
import Loading from "../../../../_helper/_loading";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";

export default function SendOtpToEmailModal({ objProps }) {
  const { profileData } = objProps;
  console.log(objProps);
  const [loading, setLoading] = useState(false);

  const initData = { otp: "" };
  const validationSchema = Yup.object({
    otp: Yup.string()
      .matches(/^\d+$/, "OTP must be a number") // Ensures OTP consists only of digits
      .length(6, "OTP must be exactly 6 digits") // Ensures OTP has 6 digits
      .required("OTP is required"),
  });

  const saveHandler = (values, cb) => {
    console.log(values);
    cb && cb();
  };
  return (
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
        handleChange,
        setFieldValue,
        isValid,
      }) => (
        <div>
          {loading && <Loading />}
          <div className="container">
            <form enctype="multipart/form-data" onSubmit={handleSubmit}>
              <div className="d-flex flex-column py-5 mx-auto text-center">
                <h6>
                  Are you sure to send <strong>OTP</strong> in your email
                </h6>
                <h4 className="text-primary">{profileData?.emailAddress}</h4>

                <input
                  type="submit"
                  className="btn btn-primary"
                  value="Send Mail"
                ></input>
              </div>

              <div className="d-flex flex-column align-items-center">
                <div>
                  <InputField
                    value={values?.otp}
                    label="OTP"
                    name="otp"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("otp", e.target.value);
                    }}
                  />
                </div>
                <div className="mt-2">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => console.log("A")}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </Formik>
  );
}
