import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";

// Validation schema
const validationSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .min(6, "Minimum 6 symbols")
    .max(50, "Maximum 100 symbols")
    .required("Old Password required"),
  newPassword: Yup.string()
    .min(6, "Minimum 6 symbols")
    .max(50, "Maximum 100 symbols")
    .required("New Password required"),
  confirmPassowrd: Yup.string()
    .min(6, "Minimum 6 symbols")
    .max(50, "Maximum 100 symbols")
    .required("Confirm Password required")
    .when("newPassword", {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref("newPassword")],
        "Both password need to be the same"
      ),
    }),
});

export default function _Form({
  initData,
  saveHandler,
  resetBtnRef,
  disableHandler,
  btnRef,
  logoutClick,
  showPasswordHandler,
  showpassword,
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
            logoutClick();
          });
        }}
      >
        {({ resetForm, values, isValid, handleSubmit }) => (
          <>
            {disableHandler(!isValid)}
            <Form className="form form-label-right change_passWord_form ">
              <div className="form-group row global-form">
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <div className="w-100">
                      <IInput
                        value={values.oldPassword}
                        label="Old Password"
                        name="oldPassword"
                        type={showpassword.oldPassword ? "text" : "password"}
                      />
                    </div>
                    <i
                      class="far fa-eye pl-2"
                      onClick={() => showPasswordHandler("oldPassword")}
                      style={{
                        position: "absolute",
                        right: "21px",
                        top: "27px",
                      }}
                    ></i>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                  <div className="w-100">
                      <IInput
                        value={values.newPassword}
                        label="New Password"
                        name="newPassword"
                        type={showpassword.newPassword ? "text" : "password"}
                      />
                    </div>
                    <i
                      class="far fa-eye pl-2"
                      onClick={() => showPasswordHandler("newPassword")}
                      style={{
                        position: "absolute",
                        right: "21px",
                        top: "27px",
                      }}
                    ></i>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                  <div className="w-100">
                      <IInput
                        value={values.confirmPassowrd}
                        label="Confirm Password"
                        name="confirmPassowrd"
                        type={
                          showpassword.confirmPassowrd ? "text" : "password"
                        }
                      />
                    </div>
                    <i
                      class="far fa-eye pl-2"
                      onClick={() => showPasswordHandler("confirmPassowrd")}
                      style={{
                        position: "absolute",
                        right: "21px",
                        top: "27px",
                      }}
                    ></i>
                  </div>
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
