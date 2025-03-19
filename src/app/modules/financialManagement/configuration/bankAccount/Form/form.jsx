import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { IInput } from "../../../../_helper/_input";
import customStyles from "../../../../selectCustomStyle";

// Validation schema
const validationSchema = Yup.object().shape({
  bank: Yup.object().shape({
    label: Yup.string().required("Bank is required"),
    value: Yup.string().required("Bank is required"),
  }),
  branch: Yup.object().shape({
    label: Yup.string().required("Branch is required"),
    value: Yup.string().required("Branch is required"),
  }),
  bankAccountType: Yup.object().shape({
    label: Yup.string().required("Bank Account Type is required"),
    value: Yup.string().required("Bank Account Type is required"),
  }),
  accountName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Account Name is required"),
  accountNumber: Yup.string()
    .min(8, "Minimum 8 symbols")
    .max(1000, "Maximum 1000 symbols")
    .required("Account Number is required"),
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
  disableHandler,
  bankDDL,
  bankAccountTypeDDL,
  profileData,
  selectedBusinessUnit,
  isEdit,
  ty,
}) {
  const [branchList, setBranchList] = useState([]);
  const [generalLedgerList, setGeneralLedgerList] = useState("");
  const [gneralLedgerListOption, setgneralLedgerOption] = useState([]);
  // Get branchList by bankId and countryId
  const branchListAPiCaller = async (bankId) => {
    const res = await Axios.get(
      `/costmgmt/BankAccount/GETBankBranchDDl?BankId=${bankId}&CountryId=18`
    );
    const { status, data } = res;
    if (status && data.length) {
      let branchLocationList = [];
      data &&
        data.forEach((item) => {
          let items = {
            value: item?.value,
            label: item?.label,
          };
          branchLocationList.push(items);
        });
      setBranchList(branchLocationList);
      branchLocationList = null;
    }
  };
  // Get generalLedger DDl
  useEffect(() => {
    generalLedgerListAPiCaller(
      profileData?.accountId,
      selectedBusinessUnit.value
    );
  }, [profileData, selectedBusinessUnit]);
  const generalLedgerListAPiCaller = async (accId, buId) => {
    try {
      const res = await Axios.get(
        `/domain/BusinessUnitGeneralLedger/GetGeneralLedgerDDL?AccountId=${accId}&BusinessUnitId=${buId}`
      );
      setGeneralLedgerList(res.data);
    } catch (error) {
     
    }
  };
  useEffect(() => {
    const glTypes = [];
    generalLedgerList &&
      generalLedgerList.forEach((item) => {
        let items = {
          value: item.generalLedgerId,
          label: item.generalLedgerName,
        };
        glTypes.push(items);
      });
    setgneralLedgerOption(glTypes);
  }, [generalLedgerList]);
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
                <div className="col-lg-4">
                  <ISelect
                    label="Select Bank"
                    options={bankDDL}
                    value={values.bank}
                    name="bank"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    onChange={(valueOption) => {
                      setFieldValue("bank", valueOption);
                      branchListAPiCaller(valueOption?.value);
                      setFieldValue("branch", "");
                    }}
                    isSearchable={true}
                    // isDisabled={isEdit}
                  />
                </div>
                <div className="col-lg-4">
                  <ISelect
                    label="Select Branch"
                    options={branchList}
                    placeholder="Select Branch"
                    value={values?.branch}
                    name="branch"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    onChange={(valueOption) => {
                      setFieldValue("branch", valueOption);
                    }}
                    isSearchable={true}
                    isDisabled={!bankDDL.length}
                    style={customStyles}
                  />
                </div>
                <div className="col-lg-4">
                  <ISelect
                    label="Select Bank Account Type"
                    options={bankAccountTypeDDL}
                    value={values?.bankAccountType}
                    name="bankAccountType"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    isSearchable={true}
                    // isDisabled={isEdit}
                  />
                </div>
                <div className="col-lg-4">
                  <IInput
                    value={values.accountName}
                    label="Account Name"
                    name="accountName"
                    // disabled={isEdit}
                  />
                </div>
                <div className="col-lg-4">
                  <IInput
                    value={values.accountNumber}
                    label="Account Number"
                    name="accountNumber"
                    // disabled={isEdit}
                  />
                </div>
                <div className="col-lg-4">
                  <ISelect
                    label="Select General Ledger"
                    options={gneralLedgerListOption}
                    placeholder="Select General Ledger"
                    value={values?.generalLedger}
                    name="generalLedger"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    isSearchable={true}
                    style={customStyles}
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
