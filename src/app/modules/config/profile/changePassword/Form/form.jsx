import { Form, Formik } from 'formik';
import React from 'react';
import { IInput } from '../../../../_helper/_input';
import { ChangePassValidationSchema } from '../../../../_helper/_validationSchema';

export default function FormCmp({
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
        validationSchema={ChangePassValidationSchema}
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
                        type={showpassword.oldPassword ? 'text' : 'password'}
                      />
                    </div>
                    <i
                      class="far fa-eye pl-2"
                      onClick={() => showPasswordHandler('oldPassword')}
                      style={{
                        position: 'absolute',
                        right: '21px',
                        top: '27px',
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
                        type={showpassword.newPassword ? 'text' : 'password'}
                      />
                    </div>
                    <i
                      class="far fa-eye pl-2"
                      onClick={() => showPasswordHandler('newPassword')}
                      style={{
                        position: 'absolute',
                        right: '21px',
                        top: '27px',
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
                          showpassword.confirmPassowrd ? 'text' : 'password'
                        }
                      />
                    </div>
                    <i
                      class="far fa-eye pl-2"
                      onClick={() => showPasswordHandler('confirmPassowrd')}
                      style={{
                        position: 'absolute',
                        right: '21px',
                        top: '27px',
                      }}
                    ></i>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                style={{ display: 'none' }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
              <button
                type="reset"
                style={{ display: 'none' }}
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
