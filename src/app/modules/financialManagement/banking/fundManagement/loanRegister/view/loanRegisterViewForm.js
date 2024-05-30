import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import InputField from "../../../../../_helper/_inputField";
import NewSelect from "../../../../../_helper/_select";
import {
  getBankAccountDDLByBankId,
  getBankDDL,
  getFacilityDLL,
} from "../../helper";
const disbursementPurposeDDL =[
  {value:1,label:"Duty"},
  {value:2,label:"Bill Payment"},
  {value:3,label:"Utility Payment"},
  {value:4,label:"Working Capital"},
]
const loanRegister = Yup.object().shape({
  bank: Yup.object()
    .shape({
      label: Yup.string().required("Bank is required"),
      value: Yup.string().required("Bank is required"),
    })
    .nullable(),
  facility: Yup.object()
    .shape({
      label: Yup.string().required("Facility is required"),
      value: Yup.string().required("Facility is required"),
    })
    .nullable(),
  account: Yup.object()
    .shape({
      label: Yup.string().required("Account is required"),
      value: Yup.string().required("Account is required"),
    })
    .nullable(),
});

export default function LoanRegisterViewForm({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  renewId,
}) {
  const history = useHistory();
  const [bankDDL, setBankDDL] = useState([]);
  const [accountDDL, setAccountDDL] = useState([]);
  const [facilityDDL, setFacilityDDL] = useState([]);
  const [, setLoading] = useState(false);
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getBankDDL(setBankDDL, setLoading);
    getFacilityDLL(setFacilityDDL, setLoading);
  }, []);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={loanRegister}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            history.push("/financial-management/banking/loan-register");
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
              <div className="row global-form h-100">
                <div className="col-lg-4">
                  <NewSelect
                    name="bank"
                    options={bankDDL}
                    value={values?.bank}
                    onChange={(valueOption) => {
                      setFieldValue("bank", valueOption);
                      setFieldValue("account", "");
                      getBankAccountDDLByBankId(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setAccountDDL,
                        setLoading
                      );
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit || renewId}
                    label="Bank"
                    placeholder="Bank"
                  />
                </div>
                <div className="col-lg-4">
                  <NewSelect
                    name="account"
                    options={accountDDL}
                    value={values?.account}
                    onChange={(valueOption) => {
                      setFieldValue("account", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit || renewId}
                    label="Bank Account"
                    placeholder="Bank Account"
                  />
                </div>
                <div className="col-lg-4">
                  <NewSelect
                    name="facility"
                    options={facilityDDL}
                    value={values?.facility}
                    onChange={(valueOption) => {
                      setFieldValue("facility", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit || renewId}
                    label="Facility"
                    placeholder="Facility"
                  />
                </div>
                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>Loan Acc No</label>
                  <InputField
                    value={values?.loanAccNo}
                    name="loanAccNo"
                    placeholder="Loan Acc No"
                    onChange={(e) => {
                      setFieldValue("loanAccNo", e.target.value);
                    }}
                    type="string"
                    disabled={isEdit || renewId}
                  />
                </div>
                <div className="col-lg-2">
                  <label>Opening Date</label>
                  <InputField
                    value={values?.openingDate}
                    name="openingDate"
                    placeholder="Date"
                    type="date"
                    disabled={isEdit}
                  />
                </div>
                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>Term (Days)</label>
                  <InputField
                    value={values?.termDays}
                    name="termDays"
                    placeholder="Term (Days)"
                    onChange={(e) => {
                      if (e.target.value > 0) {
                        setFieldValue("termDays", e.target.value);
                      } else {
                        setFieldValue("termDays", "");
                      }
                    }}
                    type="number"
                    min="0"
                    step="any"
                    disabled={isEdit}
                  />
                </div>
                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>Principle</label>
                  <InputField
                    value={values?.principle}
                    name="principle"
                    placeholder="Priciple"
                    onChange={(e) => {
                      if (e.target.value > 0) {
                        setFieldValue("principle", e.target.value);
                      } else {
                        setFieldValue("principle", "");
                      }
                    }}
                    type="number"
                    min="0"
                    step="any"
                    disabled={isEdit}
                  />
                </div>
                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>Interest Rate</label>
                  <InputField
                    value={values?.interestRate}
                    name="interestRate"
                    placeholder="Interest Rate"
                    onChange={(e) => {
                      if (e.target.value > 0) {
                        setFieldValue("interestRate", e.target.value);
                      } else {
                        setFieldValue("interestRate", "");
                      }
                    }}
                    type="number"
                    min="0"
                    step="any"
                    disabled={isEdit}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    name="disbursementPurpose"
                    options={disbursementPurposeDDL}
                    value={values?.disbursementPurpose}
                    onChange={(valueOption) => {
                      setFieldValue("disbursementPurpose", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    label="Disbursement Purpose"
                    placeholder="Disbursement Purpose"
                  />
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
