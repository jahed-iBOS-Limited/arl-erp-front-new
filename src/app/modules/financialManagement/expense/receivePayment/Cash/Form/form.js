import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import customStyles from "../../../../../selectCustomStyle";
import { IInput } from "../../../../../_helper/_input";

import FormikError from "../../../../../_helper/_formikError";

const transferJournal = Yup.object().shape({
  headerNarration: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(10000000000000000000, "Maximum 10000000000000000000 symbols")
    .required("Narration required"),

  narration: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(10000000000000000000, "Maximum 10000000000000000000 symbols")
    .required("Narration required"),

  amount: Yup.number()
    .min(1, "Minimum 1 Number")
    .max(10000000000000000000, "Maximum 10000000000000000000 Numbers")
    .required("Amount required"),

  SBU: Yup.object().shape({
    label: Yup.string().required("SBU is required"),
    value: Yup.string().required("SBU is required"),
  }),

  cashGLPlus: Yup.object().shape({
    label: Yup.string().required("Cash GL is required"),
    value: Yup.string().required("Cash GL is required"),
  }),

  profitCenter: Yup.object().shape({
    label: Yup.string().required("Profit Center is required"),
    value: Yup.string().required("Profit Center is required"),
  }),
  transaction: Yup.object().shape({
    label: Yup.string().required("Transaction is required"),
    value: Yup.string().required("Transaction is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  SBUDDL,
  cashGLDDL,
  profitCenterDDL,
  businessTransactionDDL,
  referenceTypeName,
  headerData,
}) {
  //Dispatch Get getEmpDDLAction
  // useEffect(() => {
  //   if (selectedBusinessUnit?.value && profileData?.accountId) {
  //     getBusinessPartnerDDL_Api(
  //       profileData?.accountId,
  //       selectedBusinessUnit.value,
  //       setBusinessPartnerDDL
  //     );
  //     if (headerData?.accountingJournalTypeId === 1) {
  //       generalLedgerTypeId_Api(
  //         profileData?.accountId,
  //         selectedBusinessUnit.value,
  //         1,
  //         setGeneralLedgerDDL
  //       );
  //     } else if (headerData?.accountingJournalTypeId === 2) {
  //       generalLedgerTypeId_Api(
  //         profileData?.accountId,
  //         selectedBusinessUnit.value,
  //         1,
  //         setGeneralLedgerDDL
  //       );
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedBusinessUnit, profileData]);
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
                  <div className="row bank-journal bank-journal-custom bj-left pb-3">
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
                      <label>Select Cash GL</label>
                      <Select
                        label="Select Cash GL"
                        options={cashGLDDL || []}
                        value={values.cashGLPlus}
                        name="cashGLPlus"
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        isSearchable={true}
                        styles={customStyles}
                        placeholder="Select Cash GL"
                        onChange={(valueOption) => {
                          setFieldValue("cashGLPlus", valueOption);
                        }}
                      />
                      <FormikError
                        errors={errors}
                        name="cashGLPlus"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1 mb-2">
                      <IInput
                        value={values.headerNarration}
                        label="Header Narration"
                        name="headerNarration"
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
                        padding: "15px 0 15px 20px",
                        margin: 0,
                        fontSize: "12px",
                      }}
                    >
                      {headerData?.values?.transactionType?.value === 2 ? (
                        <li className="pb-1">
                          <b>Employee Info:</b>{" "}
                          {headerData?.values?.employeeEnroll?.label}
                        </li>
                      ) : (
                        <>
                          <li className="pb-1">
                            <b>Employee Info:</b>{" "}
                            {referenceTypeName?.employeeName}
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
                        </>
                      )}
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
