import { Field, Form, Formik } from "formik";
import React from "react";
import Select from "react-select";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import customStyles from "../../../../selectCustomStyle";
import { getBusinessTransactionDDL } from './helper';

// Validation schema
const validationSchema = Yup.object().shape({
  costElementName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Element Name is required"),
  // costElementCode: Yup.string()
  //   .min(2, "Minimum 2 symbols")
  //   .max(100, "Maximum 100 symbols")
  //   .required("Code is required"),
  controllingUnit: Yup.object().shape({
    label: Yup.string().required("Controlling unit is required"),
    value: Yup.string().required("Controlling unit is required"),
  }),
  businessTransaction: Yup.object().shape({
    label: Yup.string().required("Business Transaction unit is required"),
    value: Yup.string().required("Business Transaction unit is required"),
  }),
  // costCenter: Yup.object().shape({
  //   label: Yup.string().required("Cost center is required"),
  //   value: Yup.string().required("Cost center is required"),
  // }),
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
  costCenterDDL,
  generalLedgerDDL,
  disableHandler,
  controllUniIdFunc,
  controllingUnitDDL,
  isEdit,
  accountId,
  selectedBusinessUnit,
  businessTransactionDDL,
  setBusinessTransactionDDL
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
                  <Field
                    value={values.costElementName || ""}
                    name="costElementName"
                    component={Input}
                    placeholder="Element Name"
                    label="Element Name"
                  />
                </div>

                <div className="col-lg-3">
                  <label>Select General Ledger</label>
                  {/* {console.log(values.generalLedger)} */}
                  <Field
                    name="generalLedger"
                    placeholder="Select General Ledger"
                    component={() => (
                      <Select
                        options={generalLedgerDDL}
                        placeholder="Select General Ledger"
                        value={values?.generalLedger}
                        onChange={(valueOption) => {
                          getBusinessTransactionDDL(
                            accountId,
                            selectedBusinessUnit?.value,
                            valueOption?.value,
                            setBusinessTransactionDDL
                          )
                          setFieldValue("generalLedger", valueOption);
                          setFieldValue("businessTransaction", "");
                        }}
                        isSearchable={true}
                        styles={customStyles}
                      />
                    )}
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors &&
                    errors.generalLedger &&
                    touched &&
                    touched.generalLedger
                      ? errors.generalLedger.value
                      : ""}
                  </p>
                </div>

                <div className="col-lg-3">
                  <label>Select Business Transaction</label>
                  <Field
                    name="businessTransaction"
                    placeholder="Select Business Transaction"
                    component={() => (
                      <Select
                        options={businessTransactionDDL}
                        placeholder="Select Business Transaction"
                        value={values?.businessTransaction}
                        onChange={(valueOption) => {
                          setFieldValue("businessTransaction", valueOption);
                        }}
                        // isSearchable={true}
                        styles={customStyles}
                      />
                    )}
                  />
                   <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors &&
                    errors.businessTransaction &&
                    touched &&
                    touched.businessTransaction
                      ? errors.businessTransaction.value
                      : ""}
                  </p>
                </div>

                <div className="col-lg-3">
                  <label>Select Controlling Unit</label>
                  <Field
                    name="controllingUnit"
                    placeholder="Select Controlling Unit"
                    component={() => (
                      <Select
                        options={controllingUnitDDL}
                        isDisabled={isEdit}
                        placeholder="Select Controlling Unit"
                        value={values?.controllingUnit}
                        onChange={(valueOption) => {
                          setFieldValue("controllingUnit", valueOption);
                          controllUniIdFunc(valueOption?.value);
                          setFieldValue("costCenter", "");
                        }}
                        isSearchable={true}
                        styles={customStyles}
                      />
                    )}
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors &&
                    errors.controllingUnit &&
                    touched &&
                    touched.controllingUnit
                      ? errors.controllingUnit.value
                      : ""}
                  </p>
                </div>

                <div className="col-lg-12">
                  <label>Select Cost Center</label>
                  <Field
                    name="costCenter"
                    component={() => (
                      <Select
                        options={costCenterDDL}
                        placeholder="Select Cost Center"
                        value={values.costCenter || ""}
                        onChange={(valueOption) => {
                          setFieldValue(
                            "costCenter",
                            valueOption || ""
                          );
                        }}
                        styles={{
                          ...customStyles,
                          control: (provided, state) => ({
                            ...provided,
                            minHeight: "30px",
                            height: "auto",
                          }),
                          valueContainer: (provided, state) => ({
                            ...provided,
                            height: "auto",
                            padding: "0 6px",
                          }),
                        }}
                        name="costCenter"
                        isDisabled={!values?.controllingUnit}
                        isMulti
                      />
                    )}
                    placeholder="Select Cost Center"
                    label="Select Cost Center"
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors &&
                    errors.costCenter &&
                    touched &&
                    touched.org
                      ? errors.costCenter
                      : ""}
                  </p>
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
