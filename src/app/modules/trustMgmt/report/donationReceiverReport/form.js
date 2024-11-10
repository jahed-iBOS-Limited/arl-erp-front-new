import React from "react";
import { Formik, Form } from "formik";
import InputField from "../../../_helper/_inputField";

export default function _Form({ initData, saveHandler }) {

  return (
    <>
      <Formik
        enableReinitialize={true}
        // validationSchema={validationSchema}
        initialValues={initData}
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
          setFieldValue,
          isValid,
          errors,
          touched,
          setValues,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-8">
                  <div className="form-group row global-form">
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Applicant Name
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <InputField
                            value={values?.applicantName}
                            name="applicantName"
                            placeholder=""
                            type="text"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Beneficiary Name
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <InputField
                            value={values?.beneficiaryName}
                            name="beneficiaryName"
                            placeholder=""
                            type="text"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Account Holder
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <InputField
                            value={values?.accountHolder}
                            name="accountHolder"
                            placeholder=""
                            type="text"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Account No
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <InputField
                            value={values?.accountNo}
                            name="accountNo"
                            placeholder=""
                            type="text"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Registration No
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <InputField
                            value={values?.registrationNo}
                            name="registrationNo"
                            placeholder=""
                            type="text"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Mobile No
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <InputField
                            value={values?.mobileNo}
                            name="mobileNo"
                            placeholder=""
                            type="text"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="text-right">
                        <button
                          type="submit"
                          style={{ fontSize: "12px" }}
                          className="btn btn-primary"
                          onSubmit={() => handleSubmit()}
                        >
                          Show Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
