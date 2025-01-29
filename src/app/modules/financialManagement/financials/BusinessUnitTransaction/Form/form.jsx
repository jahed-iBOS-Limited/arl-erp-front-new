import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { IInput } from "../../../../_helper/_input";

// Validation schema
const validationSchema = Yup.object().shape({
  // businessTransactionCode: Yup.string()
  //   .min(2, "Minimum 2 symbols")
  //   .max(100, "Maximum 100 symbols")
  //   .required("Code is required"),
  businessTransactionName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required(" Business Transaction is required"),
  generalLedger: Yup.object().shape({
    label: Yup.string().required("General Ledger is required"),
    value: Yup.string().required("General Ledger is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  generalLedger,
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
              <div className="form-group row">
                <div className="col-lg-3">
                  <IInput
                    value={values.businessTransactionName}
                    label="Business Transaction"
                    name="businessTransactionName"
                    disabled={isEdit}
                  />
                </div>

                {/* <div className="col-lg-3">
                  <IInput
                    value={values.businessTransactionCode}
                    label="Business Transaction Code"
                    name="businessTransactionCode"
                    disabled={isEdit}
                  />
                </div> */}

                <div className="col-lg-3">
                  <ISelect
                    label="Select General Ledger"
                    // options={generalLedger?.length ? generalLedger?.filter((item)=> item?.isSubGlAllowed) : []}
                    options={generalLedger || []}
                    value={values.generalLedger}
                    name="generalLedger"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <div
                    style={{ position: "relative", top: "23px" }}
                    className="mr-2"
                  >
                    <label htmlFor="isInternalExpense">
                      Is Internal Expense?
                    </label>
                    <Field
                      name="isInternalExpense"
                      component={() => (
                        <input
                          id="isInternalExpense"
                          type="checkbox"
                          style={{ position: "relative", top: "2px" }}
                          label="Is Internal Expense?"
                          className="ml-2"
                          value={values?.isInternalExpense}
                          checked={values?.isInternalExpense}
                          name="isInternalExpense"
                          onChange={(e) => {
                            setFieldValue(
                              "isInternalExpense",
                              e.target.checked
                            );
                          }}
                        />
                      )}
                    />
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
