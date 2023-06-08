import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
const deductionSchema = Yup.object().shape({
  vat: Yup.number()
    .min(1, "Minimum 1 symbols")
    .max(10000000, "Maximum 10000000 symbols")
    .required("VAT required"),
  sd: Yup.number()
    .min(1, "Minimum 1 symbols")
    .max(10000000, "Maximum 10000000 symbols")
    .required("SD required"),
  date: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(1000, "Maximum 100 symbols")
    .required("Date required"),
});
const openingBalanceSchema = Yup.object().shape({
  vat: Yup.number()
    .min(1, "Minimum 1 symbols")
    .max(10000000, "Maximum 10000000 symbols")
    .required("VAT required"),
  sd: Yup.number()
    .min(1, "Minimum 1 symbols")
    .max(10000000, "Maximum 10000000 symbols")
    .required("SD required"),
  surcharge: Yup.number()
    .min(1, "Minimum 1 symbols")
    .max(10000000, "Maximum 10000000 symbols")
    .required("surcharge required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  status,
  isDisabled,
  setShowModel
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
        }}
        validationSchema={
          status === "deduction" ? deductionSchema : openingBalanceSchema
        }
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setShowModel(false);
          });
        }}
      >
        {({ handleSubmit, resetForm, values, isValid }) => (
          <>
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <label>VAT</label>
                  <InputField
                    value={values?.vat}
                    name="vat"
                    placeholder="VAT"
                    type="number"
                    min="0"
                  />
                </div>
                <div className="col-lg-3">
                  <label>SD</label>
                  <InputField
                    value={values?.sd}
                    name="sd"
                    placeholder="SD"
                    type="number"
                    min="0"
                  />
                </div>
                {status !== "deduction" && (
                  <div className="col-lg-3">
                    <label>Surcharge</label>
                    <InputField
                      value={values?.surcharge}
                      name="surcharge"
                      placeholder="Surcharge"
                      type="number"
                      min="0"
                    />
                  </div>
                )}

                {status === "deduction" && (
                  <div className="col-lg-3">
                    <label>Date</label>
                    <InputField
                      value={values?.date}
                      name="date"
                      placeholder="Date"
                      type="date"
                    />
                  </div>
                )}
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
