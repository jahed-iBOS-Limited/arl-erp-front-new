import { Form, Formik } from 'formik';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { IInput } from '../../../../../_helper/_input';
import { ChangePassValidationSchema } from '../../../../../_helper/_validationSchema';
import { updateSupplierPasss } from '../helper';

const initData = {
  oldPassword: '',
  newPassword: '',
  confirmPassowrd: '',
};

const ChangeSupplierPassword = ({
  isChangePassModal,
  setIsChangePassModal,
  logoutClick,
}) => {
  const [showOldPassword, setShowOldPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassowrd, setShowConfirmPassowrd] = React.useState(false);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={ChangePassValidationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({
          resetForm,
          values,
          isValid,
          handleSubmit,
          btnRef,
          resetBtnRef,
        }) => (
          <>
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right change_passWord_form ">
              <div className="form-group row global-form">
                <div className="col-md-3">
                  <div className="d-flex align-items-center">
                    <div className="w-100">
                      <IInput
                        value={values.oldPassword}
                        label="Old Password"
                        name="oldPassword"
                        type={showOldPassword ? 'text' : 'password'}
                      />
                    </div>
                    <i
                      class="far fa-eye pl-2"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      style={{
                        position: 'absolute',
                        right: '21px',
                        top: '27px',
                      }}
                    ></i>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="d-flex align-items-center">
                    <div className="w-100">
                      <IInput
                        value={values.newPassword}
                        label="New Password"
                        name="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                      />
                    </div>
                    <i
                      class="far fa-eye pl-2"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: 'absolute',
                        right: '21px',
                        top: '27px',
                      }}
                    ></i>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="d-flex align-items-center">
                    <div className="w-100">
                      <IInput
                        value={values.confirmPassowrd}
                        label="Confirm Password"
                        name="confirmPassowrd"
                        type={showConfirmPassowrd ? 'text' : 'password'}
                      />
                    </div>
                    <i
                      class="far fa-eye pl-2"
                      onClick={() =>
                        setShowConfirmPassowrd(!showConfirmPassowrd)
                      }
                      style={{
                        position: 'absolute',
                        right: '21px',
                        top: '27px',
                      }}
                    ></i>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="d-flex align-items-center">
                    <button
                      style={{ marginTop: '18px' }}
                      className="btn btn-primary"
                      type="submit"
                      disabled={
                        !values.oldPassword ||
                        !values.newPassword ||
                        !values.confirmPassowrd
                      }
                      onClick={() => {
                        const payload = {
                          newPassword: values.newPassword,
                          oldPassword: values.oldPassword,
                          userId: profileData.loginId,
                        };
                        updateSupplierPasss(payload, () => {
                          setIsChangePassModal(false);
                          logoutClick();
                        });
                      }}
                    >
                      Save
                    </button>
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
};

export default ChangeSupplierPassword;
