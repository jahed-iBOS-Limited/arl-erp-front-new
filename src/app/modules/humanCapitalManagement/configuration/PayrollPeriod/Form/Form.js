import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import InputField from "../../../../_helper/_inputField";

// Validation schema
const validationSchema = Yup.object().shape({
  payrollPeriodName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Department is required"),
  payrollPeriodCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Middle Name 100 symbols")
    .required("Code is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
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
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <IInput
                    value={
                      values.payrollPeriodName ? values.payrollPeriodName : ""
                    }
                    label="Payroll Period Name"
                    name="payrollPeriodName"
                  />
                </div>

                <div className="col-lg-3">
                  <IInput
                    value={
                      values.payrollPeriodCode ? values.payrollPeriodCode : ""
                    }
                    label="Payroll Period Code"
                    name="payrollPeriodCode"
                    disabled={isEdit}
                  />
                </div>

                <div className="col-lg-3">
                  <label>Start Date</label>
                  <InputField
                    value={values?.startDate ? values?.startDate : ""}
                    name="startDate"
                    placeholder="Start Date"
                    type="date"
                  />
                </div>

                <div className="col-lg-3">
                  <label>End Date</label>
                  <InputField
                    value={values?.endDate ? values?.endDate : ""}
                    name="endDate"
                    placeholder="End Date"
                    type="date"
                  />
                </div>

                <div className="col-lg-3">
                  <label>Run Date</label>
                  <InputField
                    value={values?.runDate ? values?.runDate : ""}
                    name="runDate"
                    placeholder="Run Date"
                    type="date"
                  />
                </div>

                <div className="col-lg-3">
                  <label>Pay Date</label>
                  <InputField
                    value={values?.payDate ? values?.payDate : ""}
                    name="payDate"
                    placeholder="Pay Date"
                    type="date"
                  />
                </div>
              </div>

              {/* <div className="row">
                <div className="col-lg">

                </div>
              </div> */}

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
