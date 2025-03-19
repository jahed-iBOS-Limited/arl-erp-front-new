import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import customStyles from "../../../../../selectCustomStyle";
import { IInput } from "../../../../../_helper/_input";

import FormikError from "../../../../../_helper/_formikError";

const transferJournal = Yup.object().shape({
  instrumentNo: Yup.string().required("Instrument no is required"),
  amount: Yup.number()
    .min(1, "Minimum 1 Number")
    .max(
      1000000000000000000000000000000,
      "Maximum 1000000000000000000000000000000 Number"
    )
    .required("Amount required"),
  placingDate: Yup.string().required("Placing date is required"),
  instrumentDate: Yup.string().required("Instrument Date is required"),
  SBU: Yup.object().shape({
    label: Yup.string().required("SBU is required"),
    value: Yup.string().required("SBU is required"),
  }),

  bankAc: Yup.object().shape({
    label: Yup.string().required("Bank Ac is required"),
    value: Yup.string().required("Bank Ac is required"),
  }),

  profitCenter: Yup.object().shape({
    label: Yup.string().required("Profit Center is required"),
    value: Yup.string().required("Profit Center is required"),
  }),

  transaction: Yup.object().shape({
    label: Yup.string().required("Transaction is required"),
    value: Yup.string().required("Transaction is required"),
  }),

  instrumentType: Yup.object().shape({
    label: Yup.string().required("Instrument Type is required"),
    value: Yup.string().required("Instrument Type is required"),
  }),

  narration: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(10000000000000000000, "Maximum 10000000000000000000 symbols")
    .required("Narration required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  headerData,
  businessTransactionDDL,
  profitCenterDDL,
  SBUDDL,
  bankAcDDL,
  instrumentType,
  referenceTypeName,
}) {
  const remainingAmount =
    referenceTypeName?.advancedAmount - referenceTypeName?.adjustedAmount;
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={transferJournal}
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
              <div className="row">
                {/* Start Left */}
                <div className="col-lg-9">
                  <div className="row bank-journal bank-journal-custom bj-left mb-2">
                    <div className="col-lg-3 pl pr-1 mb-2">
                      <label>Select SBU</label>
                      <Select
                        label="Select SBU"
                        options={SBUDDL || []}
                        value={values.SBU}
                        name="SBU"
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        isSearchable={true}
                        styles={customStyles}
                        placeholder="Select SBU"
                        onChange={(valueOption) => {
                          setFieldValue("SBU", valueOption);
                        }}
                      />
                      <FormikError
                        errors={errors}
                        name="SBU"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1 mb-2">
                      <label>Select Bank Ac</label>
                      <Select
                        label="Select Bank Ac"
                        options={bankAcDDL || []}
                        value={values.bankAc}
                        name="bankAc"
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        isSearchable={true}
                        styles={customStyles}
                        placeholder="Select Bank Ac"
                        onChange={(valueOption) => {
                          setFieldValue("bankAc", valueOption);
                        }}
                      />
                      <FormikError
                        errors={errors}
                        name="bankAc"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1  d-flex justify-content-center align-items-center">
                      <span className="mr-2">Placed in Bank</span>
                      <Field
                        type="checkbox"
                        name="placedInBank"
                        checked={values.placedInBank}
                        onChange={(e) => {
                          setFieldValue("placedInBank", e.target.checked);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <IInput
                        value={values.placingDate}
                        label="Placing Date"
                        name="placingDate"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1 mb-2">
                      <label>Select Profit Center</label>
                      <Select
                        label="Select Profit Center"
                        options={profitCenterDDL || []}
                        value={values.profitCenter}
                        name="profitCenter"
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        isSearchable={true}
                        styles={customStyles}
                        placeholder="Select Profit Center"
                        onChange={(valueOption) => {
                          setFieldValue("profitCenter", valueOption);
                        }}
                      />
                      <FormikError
                        errors={errors}
                        name="profitCenter"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1 mb-2">
                      <label>Select Transaction</label>
                      <Select
                        label="Select Transaction"
                        options={businessTransactionDDL || []}
                        value={values.transaction}
                        name="transaction"
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        isSearchable={true}
                        styles={customStyles}
                        placeholder="Select Transaction"
                        onChange={(valueOption) => {
                          setFieldValue("transaction", valueOption);
                          setFieldValue(
                            "GLInfo",
                            `${valueOption?.generalLedgerCode}, ${valueOption?.generalLedgerName} `
                          );
                        }}
                      />
                      <FormikError
                        errors={errors}
                        name="transaction"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1 mb-2">
                      <IInput
                        value={values.amount}
                        label="Amount"
                        name="amount"
                        type="number"
                        min="0"
                        max={remainingAmount}
                        required
                      />
                    </div>

                    <div className="col-lg-3 pl pr-1">
                      <label>Select Instrument Type</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("instrumentType", valueOption);
                        }}
                        value={values?.instrumentType}
                        isSearchable={true}
                        options={instrumentType || []}
                        styles={customStyles}
                        placeholder="Instrument Type"
                      />
                      <FormikError
                        errors={errors}
                        name="instrumentType"
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-3 pl pr-1 mb-2">
                      <IInput
                        value={values.instrumentNo}
                        label="Instrument No"
                        name="instrumentNo"
                      />
                    </div>

                    <div className="col-lg-3 pl-date pr pl-1 mb-2 bank-journal-date border-gray">
                      <IInput
                        value={values.instrumentDate}
                        label="Instrument Date"
                        name="instrumentDate"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1 mb-2">
                      <IInput
                        value={values.GLInfo}
                        label="GL Info"
                        name="GLInfo"
                        type="text"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1 mb-2">
                      <IInput
                        value={values.narration}
                        label="Narration"
                        name="narration"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
                {/* End Left */}
                <div className="col-lg-3">
                  <div
                    className="receivepayment_Info"
                    style={{ background: "#dde3e8" }}
                  >
                    <ul
                      style={{
                        listStyle: "none",
                        padding: "35px 0 36px 20px",
                        margin: 0,
                        fontSize: "12px",
                      }}
                    >
                      <li className="pb-1">
                        <b>Employee Info:</b> {referenceTypeName?.employeeName}
                      </li>
                      <li className="pb-1">
                        <b>Advanced Amount: </b>
                        {referenceTypeName?.advancedAmount}
                      </li>
                      <li className="pb-1">
                        <b>Previous Adjusted: </b>{" "}
                        {referenceTypeName?.adjustedAmount}
                      </li>
                      <li className="pb-1">
                        <b>Remaining Amount: </b>
                        {remainingAmount}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Row Dto Table End */}

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
